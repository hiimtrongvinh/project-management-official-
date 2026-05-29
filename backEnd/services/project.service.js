const ProjectModel = require('../models/project.model');
const { generateProjectId } = require('../utils/helpers');
const { query } = require('../config/database');
const { getAccountIdByClientId, getProjectMemberAccountIds, getProjectClientAccountId, getAdminAccountIds, notify } = require('../utils/notificationHelpers');

/**
 * Step status labels mapping
 */
const STEP_LABELS = {
  1: 'Khảo sát và lập kế hoạch',
  2: 'Mua thiết bị và lập báo giá',
  3: 'Xác nhận thỏa thuận',
  4: 'Triển khai lắp đặt',
  5: 'Bàn giao và nghiệm thu',
  6: 'Thanh toán'
};

/**
 * Project Service - Business logic for project management
 */
const ProjectService = {
  /**
   * Create a new project.
   * Generates PRJxx ID, validates dates, sets initial step/progress/status.
   * @param {Object} data - { title, description, category, clientId, startDate, endDate }
   * @param {number} creatorId - Account ID of the creator
   * @returns {Promise<Object>} Created project
   */
  async createProject(data, creatorId) {
    const { title, description, category, clientId, startDate, endDate, deadline, budget, currentStep } = data;

    // Validate required fields
    if (!title) {
      const error = new Error('Project title is required');
      error.statusCode = 400;
      throw error;
    }

    const projectDeadline = deadline || endDate;
    if (!projectDeadline) {
      const error = new Error('Project deadline is required');
      error.statusCode = 400;
      throw error;
    }

    // Validate dates: deadline >= start_date
    if (startDate && projectDeadline && new Date(projectDeadline) < new Date(startDate)) {
      const error = new Error('Deadline must be greater than or equal to start date');
      error.statusCode = 400;
      throw error;
    }

    // Generate project ID
    const projectId = await generateProjectId();

    // Create project
    await ProjectModel.create({
      id: projectId,
      title,
      description: description || null,
      category: category || null,
      client_id: clientId || null,
      start_date: startDate || null,
      deadline: projectDeadline,
      current_step: currentStep !== undefined ? currentStep : 1,
      budget: budget || null,
      created_by: creatorId
    });

    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [creatorId, 'project_created', 'project', projectId, JSON.stringify({ title })]
    );

    // Thông báo cho khách hàng liên quan
    if (clientId) {
      const clientAccountId = await getAccountIdByClientId(clientId);
      if (clientAccountId) {
        notify([clientAccountId], {
          type: 'project_created',
          title: 'Dự án mới đã được tạo',
          message: `Dự án "${title}" đã được e-Teck khởi tạo cho bạn.`,
          related_type: 'project',
          related_id: projectId
        });
      }
    }

    return ProjectModel.findById(projectId);
  },

  /**
   * Get projects with role-based filtering.
   * Admin sees all, Staff sees assigned, Client sees own.
   * @param {Object} filters - { status, category, search, page, limit }
   * @param {number} userId - Account ID
   * @param {string} role - User role
   * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
   */
  async getProjects(filters = {}, userId, role) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;

    if (role === 'admin') {
      const result = await ProjectModel.findAll(filters, page, limit);
      return { ...result, page, limit };
    }

    if (role === 'staff') {
      // Get staff ID from account ID
      const staffRows = await query('SELECT id FROM staffs WHERE account_id = ?', [userId]);
      if (staffRows.length === 0) {
        return { data: [], total: 0, page, limit };
      }
      const staffId = staffRows[0].id;
      const result = await ProjectModel.findByMember(staffId, page, limit);
      return { ...result, page, limit };
    }

    if (role === 'client') {
      // Get client ID from account ID
      const clientRows = await query('SELECT id FROM clients WHERE account_id = ?', [userId]);
      if (clientRows.length === 0) {
        return { data: [], total: 0, page, limit };
      }
      const clientId = clientRows[0].id;
      const result = await ProjectModel.findByClient(clientId, page, limit);
      return { ...result, page, limit };
    }

    return { data: [], total: 0, page, limit };
  },

  /**
   * Get a project by ID with role-based access check.
   * @param {string} id - Project ID
   * @param {number} userId - Account ID
   * @param {string} role - User role
   * @returns {Promise<Object>} Project data
   */
  async getProjectById(id, userId, role) {
    const project = await ProjectModel.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Role-based access check
    if (role === 'staff') {
      const staffRows = await query('SELECT id FROM staffs WHERE account_id = ?', [userId]);
      if (staffRows.length === 0) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
      }
      const staffId = staffRows[0].id;
      const memberRows = await query(
        'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
        [id, staffId]
      );
      if (memberRows.length === 0) {
        const error = new Error('Access denied. You are not a member of this project.');
        error.statusCode = 403;
        throw error;
      }
    }

    if (role === 'client') {
      const clientRows = await query('SELECT id FROM clients WHERE account_id = ?', [userId]);
      if (clientRows.length === 0 || project.client_id !== clientRows[0].id) {
        const error = new Error('Access denied. This project does not belong to you.');
        error.statusCode = 403;
        throw error;
      }
    }

    // Get members
    const members = await ProjectModel.getMembers(id);

    // Get documents
    const docRows = await query('SELECT id, file_name, file_path, created_at FROM project_documents WHERE project_id = ?', [id]);

    return { ...project, members, documents: docRows };
  },

  /**
   * Update a project.
   * @param {string} id - Project ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(id, data) {
    const project = await ProjectModel.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Validate dates if provided
    const startDate = data.startDate || data.start_date || project.start_date;
    const projectDeadline = data.deadline || data.endDate || data.end_date || project.deadline;
    if (startDate && projectDeadline && new Date(projectDeadline) < new Date(startDate)) {
      const error = new Error('Deadline must be greater than or equal to start date');
      error.statusCode = 400;
      throw error;
    }

    // Map camelCase to snake_case
    const updateData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.clientId !== undefined) updateData.client_id = data.clientId;
    if (data.client_id !== undefined) updateData.client_id = data.client_id;
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.start_date !== undefined) updateData.start_date = data.start_date;
    if (data.endDate !== undefined) updateData.deadline = data.endDate;
    if (data.end_date !== undefined) updateData.deadline = data.end_date;
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.current_step !== undefined) updateData.current_step = data.current_step;

    await ProjectModel.update(id, updateData);

    return ProjectModel.findById(id);
  },

  /**
   * Delete a project. CASCADE handles children.
   * @param {string} id - Project ID
   * @returns {Promise<void>}
   */
  async deleteProject(id) {
    const project = await ProjectModel.findById(id);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    await ProjectModel.delete(id);
  },

  /**
   * Add a member to a project.
   * @param {string} projectId - Project ID
   * @param {string} staffId - Staff ID
   * @param {string} role - Role in project
   * @returns {Promise<Object>} Updated members list
   */
  async addMember(projectId, staffId, role) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify staff exists
    const staffRows = await query('SELECT id FROM staffs WHERE id = ?', [staffId]);
    if (staffRows.length === 0) {
      const error = new Error('Staff not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if already a member
    const existingRows = await query(
      'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
      [projectId, staffId]
    );
    if (existingRows.length > 0) {
      const error = new Error('Staff is already a member of this project');
      error.statusCode = 409;
      throw error;
    }

    await ProjectModel.addMember(projectId, staffId, role);

    return ProjectModel.getMembers(projectId);
  },

  /**
   * Remove a member from a project.
   * @param {string} projectId - Project ID
   * @param {string} staffId - Staff ID
   * @returns {Promise<Object>} Updated members list
   */
  async removeMember(projectId, staffId) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if member exists
    const existingRows = await query(
      'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
      [projectId, staffId]
    );
    if (existingRows.length === 0) {
      const error = new Error('Staff is not a member of this project');
      error.statusCode = 404;
      throw error;
    }

    await ProjectModel.removeMember(projectId, staffId);

    return ProjectModel.getMembers(projectId);
  },

  /**
   * Update project status (advance step).
   * Validates all tasks in current step are 'Đã duyệt'.
   * Step can only increment by 1.
   * @param {string} projectId - Project ID
   * @param {number} newStep - New step number
   * @returns {Promise<Object>} Updated project
   */
  async updateStatus(projectId, newStep) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Validate step range
    if (newStep < 1 || newStep > 6) {
      const error = new Error('Step must be between 1 and 6');
      error.statusCode = 400;
      throw error;
    }

    // Step can only increment by 1
    if (newStep !== project.current_step + 1) {
      const error = new Error('Step can only be incremented by 1');
      error.statusCode = 400;
      throw error;
    }

    // Validate all tasks in current step are approved
    const currentStepTasks = await query(
      'SELECT id, status FROM tasks WHERE project_id = ? AND step = ?',
      [projectId, project.current_step]
    );

    if (currentStepTasks.length > 0) {
      const unapproved = currentStepTasks.filter(t => t.status !== 'Đã duyệt');
      if (unapproved.length > 0) {
        const error = new Error('All tasks in the current step must be approved before advancing');
        error.statusCode = 400;
        throw error;
      }
    }

    // Update step
    const newStatus = STEP_LABELS[newStep];
    await ProjectModel.update(projectId, {
      current_step: newStep
    });

    // Thông báo chuyển bước cho staff thành viên + khách hàng
    const memberAccountIds = await getProjectMemberAccountIds(projectId);
    const clientAccountId = await getProjectClientAccountId(projectId);
    notify([...memberAccountIds, clientAccountId], {
      type: 'project_step_advanced',
      title: `Dự án chuyển sang bước ${newStep}`,
      message: `Dự án đã chuyển sang giai đoạn: ${newStatus}.`,
      related_type: 'project',
      related_id: projectId
    });

    return ProjectModel.findById(projectId);
  },

  /**
   * Calculate project progress.
   * progress = round(approved_tasks / total_tasks * 100), 0 if no tasks.
   * @param {string} projectId - Project ID
   * @returns {Promise<number>} Progress percentage (0-100)
   */
  async calculateProgress(projectId) {
    const tasks = await query(
      'SELECT status FROM tasks WHERE project_id = ?',
      [projectId]
    );

    if (tasks.length === 0) {
      return 0;
    }

    const approvedCount = tasks.filter(t => t.status === 'Đã duyệt').length;
    const progress = Math.round((approvedCount / tasks.length) * 100);

    return progress;
  },

  /**
   * Close a project.
   * Validates step=6 and all tasks approved.
   * Sets status='Hoàn thành' and closed_at.
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Updated project
   */
  async closeProject(projectId) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Validate step is 6
    if (project.current_step !== 6) {
      const error = new Error('Project must be at step 6 to close');
      error.statusCode = 400;
      throw error;
    }

    // Validate all tasks are approved
    const tasks = await query(
      'SELECT id, status FROM tasks WHERE project_id = ?',
      [projectId]
    );

    if (tasks.length > 0) {
      const unapproved = tasks.filter(t => t.status !== 'Đã duyệt');
      if (unapproved.length > 0) {
        const error = new Error('All tasks must be approved before closing the project');
        error.statusCode = 400;
        throw error;
      }
    }

    // Close project
    await ProjectModel.update(projectId, {
      current_step: 7
    });

    // Thông báo hoàn thành cho staff thành viên + khách hàng
    const memberIds = await getProjectMemberAccountIds(projectId);
    const clientAccId = await getProjectClientAccountId(projectId);
    notify([...memberIds, clientAccId], {
      type: 'project_completed',
      title: 'Dự án đã hoàn thành',
      message: `Dự án "${project.title}" đã được hoàn thành thành công.`,
      related_type: 'project',
      related_id: projectId
    });

    return ProjectModel.findById(projectId);
  },

  async sendQuotation(projectId, creatorId) {
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Update step to 3
    await ProjectModel.update(projectId, { current_step: 3 });
    
    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [creatorId, 'quotation_sent', 'project', projectId, JSON.stringify({ title: project.title })]
    );
    
    // Notify client
    const clientAccountId = await getProjectClientAccountId(projectId);
    if (clientAccountId) {
      await notify([clientAccountId], {
        type: 'quotation_received',
        title: 'Bạn nhận được báo giá mới',
        message: `e-Teck đã gửi báo giá mới cho dự án "${project.title}". Vui lòng truy cập Portal để kiểm tra và phê duyệt.`,
        related_type: 'project',
        related_id: projectId
      });
    }
    
    return ProjectModel.findById(projectId);
  },

  async createContract(projectId, creatorId) {
    const fs = require('fs');
    const path = require('path');
    const { convertVNDToWords, convertVNDToWordsEn } = require('../utils/numberToWords');

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Fetch project materials/items
    const projectItems = await query(
      `SELECT pi.*, m.name as material_name, m.sku as material_sku, m.unit as material_unit, m.price as material_price
       FROM project_items pi
       LEFT JOIN materials m ON pi.material_id = m.id
       WHERE pi.project_id = ?`,
      [projectId]
    );

    if (projectItems.length === 0) {
      const error = new Error('No materials found in the project. Please add materials before creating a contract.');
      error.statusCode = 400;
      throw error;
    }

    // Calculate dynamic values
    let totalValue = 0;
    const itemsHtml = projectItems.map((item, index) => {
      const sellPrice = parseFloat(item.material_price || 0) * (1 + parseInt(item.markup || 10) / 100);
      const totalSell = sellPrice * parseInt(item.quantity || 1);
      totalValue += totalSell;

      return `
        <tr>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
          <td style="border: 1px solid #000; padding: 8px;">
            <strong>${item.material_name || 'Vật tư'}</strong><br>
            <small style="color: #666;">${item.material_sku || 'SKU-NONE'}</small>
          </td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.material_unit || 'cái'}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">${item.quantity || 1}</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: right;">${sellPrice.toLocaleString('vi-VN')}đ</td>
          <td style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold;">${totalSell.toLocaleString('vi-VN')}đ</td>
        </tr>
      `;
    }).join('');

    const totalWordsVi = convertVNDToWords(totalValue);
    const totalWordsEn = convertVNDToWordsEn(totalValue);

    const depositAmount = Math.round(totalValue * 0.4);
    const remainingAmount = totalValue - depositAmount;

    const depositWordsVi = convertVNDToWords(depositAmount);
    const depositWordsEn = convertVNDToWordsEn(depositAmount);

    const remainingWordsVi = convertVNDToWords(remainingAmount);
    const remainingWordsEn = convertVNDToWordsEn(remainingAmount);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    // Client Info
    const clientName = project.client_name || 'Họ và tên khách hàng';
    const clientTaxCode = project.client_tax_code || '........................';
    const clientPhone = project.client_phone || '........................';
    const clientAddress = project.client_address || '........................';

    const contractHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hợp đồng mua bán - HD-${projectId}</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 14px;
            line-height: 1.5;
            color: #000;
            margin: 0;
            padding: 40px;
            background-color: #fff;
        }
        .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 5px;
        }
        .subtitle {
            text-align: center;
            font-size: 13px;
            font-style: italic;
            margin-bottom: 30px;
        }
        .section-title {
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 15px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }
        .footer-sign {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .sign-box {
            width: 45%;
            text-align: center;
        }
        .bilingual-text {
            font-style: italic;
            color: #444;
        }
        @media print {
            body {
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
        Độc lập – Tự do – Hạnh phúc<br>
        <span class="bilingual-text">(SOCIALIST REPUBLIC OF VIETNAM<br>Independence – Freedom – Happiness)</span>
    </div>

    <div class="title">
        HỢP ĐỒNG MUA BÁN<br>
        <span style="font-size: 16px; font-weight: normal;">PURCHASING CONTRACT</span>
    </div>
    <div class="subtitle">
        Số (No.): HD-${projectId}
    </div>

    <div style="font-size: 12px; margin-bottom: 20px; font-style: italic;">
        - Căn cứ Bộ luật dân sự số: 92/2015/QH13 đã được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam khóa XIII, kỳ họp thứ 10 thông qua ngày 25 tháng 11 năm 2015<br>
        <span class="bilingual-text">(Based on Civil Law no. 92/2015/QH13 adopted by the 13rd National Assembly of the Social republic of Vietnam at the 10th meeting dated 25th November 2015)</span><br>
        - Căn cứ Luật Thương mại nước Cộng hòa xã hội chủ nghĩa Việt Nam số 36/2005/QH11<br>
        <span class="bilingual-text">(Based on Trade Law no. 36/2005/QH11 of the Social republic of Vietnam)</span><br>
        - Căn cứ vào nhu cầu và khả năng đáp ứng của hai bên; (Based on requirement, capacities and agreement of the two concerned parties);
    </div>

    <div style="text-align: right; margin-bottom: 20px; font-style: italic;">
        Hải Phòng, ngày ${day} tháng ${month} năm ${year} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Hai Phong, ${today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
    </div>

    <!-- BÊN A -->
    <div style="margin-bottom: 15px;">
        <strong>Bên A: (BÊN MUA): Party A: (THE BUYER):</strong><br>
        Đại diện (Represented by): <strong>${clientName}</strong><br>
        Địa chỉ (Address): ${clientAddress}<br>
        MST (Tax Code): ${clientTaxCode} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Điện thoại (Phone): ${clientPhone}
    </div>

    <!-- BÊN B -->
    <div style="margin-bottom: 20px;">
        <strong>Bên B: (BÊN BÁN): Party B: (THE SUPPLIER):</strong><br>
        <strong>CÔNG TY TNHH ĐÀO TẠO VÀ TÍCH HỢP CÔNG NGHỆ E-TECK</strong><br>
        <span class="bilingual-text">E-TECK TECHNOLOGY INTEGRATION AND TRAINING CO., LTD</span><br>
        Đại diện (Represented by): <strong>Ông ĐỖ QUANG ANH</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Chức vụ (Title): Giám đốc (Director)<br>
        Địa chỉ (Address): Số 24 ngõ Đoàn Kết, KDC Thanh Toàn, thôn Vĩnh Khê, xã An Đồng, huyện An Dương, thành phố Hải Phòng<br>
        MST (Tax Code): 0201873815 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Điện thoại (Phone): (84) – 225 3601 496<br>
        Tài khoản (Account No.): 88688588 tại Ngân hàng ACB – Chi nhánh Duyên Hải
    </div>

    <div style="margin-bottom: 15px; font-style: italic;">
        Sau khi thỏa thuận, hai bên thống nhất ký kết Hợp đồng kinh tế với các điều khoản sau:<br>
        <span class="bilingual-text">After negotiation, both parties have agreed to sign the present contract under following terms and conditions:</span>
    </div>

    <!-- ĐIỀU 1 -->
    <div class="section-title">Điều 1: NỘI DUNG HỢP ĐỒNG <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 1: CONTRACT CONTENT)</span></div>
    <div style="margin-left: 20px; margin-bottom: 15px;">
        1.1 Bên B sẽ cung cấp hàng hoá cho bên A như được liệt kê tại điều 2 của Hợp đồng này.<br>
        <span class="bilingual-text">(Party B will provide all the goods for Party A, as mentioned in the Article 2 of this Contract.)</span><br>
        1.2 Bên B sẽ chịu trách nhiệm vận chuyển đủ hàng hoá như bên A yêu cầu.<br>
        <span class="bilingual-text">(Party B will be responsible for transport the Goods as requirements of Party A.)</span><br>
        1.3 Hàng hoá được cung cấp phải đảm bảo là mới 100%, không có lỗi.<br>
        <span class="bilingual-text">(Goods must be 100% brand-new without error and the quality of the goods meets the requirements of Party A)</span>
    </div>

    <!-- ĐIỀU 2 -->
    <div class="section-title">Điều 2: PHẠM VI HỢP ĐỒNG <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 2: SCOPE OF THE CONTRACT)</span></div>
    <div style="margin-left: 20px; margin-bottom: 15px;">
        Bên B cung cấp cho bên A danh mục hàng hóa như bảng sau:<br>
        <span class="bilingual-text">(Party B provides the Goods for Party A, detail in the table as follows:)</span>
        
        <table style="border: 1px solid #000; width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 8px; width: 6%;">STT (No.)</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 44%;">Vật tư / Thiết bị (Material / Equipment)</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 10%;">ĐVT (Unit)</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 8%;">SL (Qty)</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 14%;">Đơn giá (Unit Price)</th>
                    <th style="border: 1px solid #000; padding: 8px; width: 18%;">Thành tiền (Total)</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
                <tr>
                    <td colspan="5" style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold;">Tổng cộng (Total Contract Value - VAT included):</td>
                    <td style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold; font-size: 15px; color: #1d4ed8;">${totalValue.toLocaleString('vi-VN')}đ</td>
                </tr>
            </tbody>
        </table>

        <strong>Bằng chữ (In words):</strong> <span style="text-transform: capitalize; font-weight: bold;">${totalWordsVi}</span><br>
        <span class="bilingual-text" style="font-weight: bold;">(${totalWordsEn})</span><br>
        Giá trị hợp đồng đã bao gồm thuế GTGT VAT 10%. Giá trị hợp đồng là giá cố định và đã bao gồm toàn bộ chi phí vận chuyển, đóng gói, bảo hiểm đến địa điểm của Bên A.
    </div>

    <!-- ĐIỀU 3 -->
    <div class="section-title">Điều 3: ĐIỀU KHOẢN THANH TOÁN <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 3: TERM OF PAYMENT)</span></div>
    <div style="margin-left: 20px; margin-bottom: 15px;">
        3.1 Việc thanh toán sẽ được thực hiện bằng đồng VND thông qua phương thức chuyển khoản.<br>
        <span class="bilingual-text">(Payment will be made in VND via bank transfer.)</span><br>
        3.2 Bên A sẽ thanh toán cho Bên B làm 02 đợt:<br>
        &nbsp;&nbsp;&nbsp;&nbsp;+ <strong>Đợt 1 (First payment):</strong> Đặt cọc 40% giá trị hợp đồng, tương đương số tiền: <strong>${depositAmount.toLocaleString('vi-VN')}đ</strong> (Bằng chữ: ${depositWordsVi} / <span class="bilingual-text">${depositWordsEn}</span>) trong vòng 05 ngày kể từ ngày ký hợp đồng.<br>
        &nbsp;&nbsp;&nbsp;&nbsp;+ <strong>Đợt 2 (Second payment):</strong> Thanh toán 60% giá trị còn lại, tương đương số tiền: <strong>${remainingAmount.toLocaleString('vi-VN')}đ</strong> (Bằng chữ: ${remainingWordsVi} / <span class="bilingual-text">${remainingWordsEn}</span>) trong vòng 30 ngày kể từ khi ký biên bản nghiệm thu bàn giao hệ thống.
    </div>

    <!-- ĐIỀU 4 -->
    <div class="section-title">Điều 4: ĐIỀU KHOẢN PHẠT <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 4: PENALTY)</span></div>
    <div style="margin-left: 20px; margin-bottom: 15px;">
        4.1 Nếu Bên B giao hàng chậm trễ, Bên B sẽ bị phạt 0.5% giá trị hợp đồng cho mỗi ngày chậm trễ. Nếu chậm trễ quá 14 ngày, Bên A có quyền đơn phương chấm dứt hợp đồng và Bên B phải bồi thường 30% giá trị hợp đồng.<br>
        <span class="bilingual-text">(If Party B delays in delivery, Party B shall pay 0.5% of contract value per delayed day. If delay exceeds 14 days, Party A can terminate unilaterally and Party B pays 30% penalty.)</span><br>
        4.2 Nếu Bên A thanh toán chậm trễ, Bên A sẽ chịu phạt 0.5% giá trị chậm thanh toán cho mỗi tuần chậm trễ nhưng tổng phạt không quá 8% giá trị hợp đồng.<br>
        <span class="bilingual-text">(If Party A delays in payment, Party A pays 0.5% of delayed amount per delayed week, capped at 8% total.)</span>
    </div>

    <!-- ĐIỀU 5 -->
    <div class="section-title">Điều 5: GIAO HÀNG <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 5: DELIVERY)</span></div>
    <div style="margin-left: 20px; margin-bottom: 15px;">
        5.1 Thời gian giao hàng: Trong vòng 01-02 tuần kể từ ngày ký hợp đồng và Bên B nhận được thanh toán Đợt 1.<br>
        <span class="bilingual-text">(Delivery time: Within 01-02 weeks from signing contract and receiving 1st payment.)</span><br>
        5.2 Chứng từ giao hàng gồm hóa đơn GTGT (VAT) hợp lệ và Biên bản bàn giao hàng hóa.<br>
        <span class="bilingual-text">(Delivery documents: Valid VAT invoice and Delivery Note/Acceptance report.)</span>
    </div>

    <!-- ĐIỀU 6 -->
    <div class="section-title">Điều 6: BẢO HÀNH <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 6: WARRANTY)</span></div>
    <div style="margin-left: 20px; margin-bottom: 15px;">
        6.1 Thời gian bảo hành: 12 tháng kể từ ngày ký biên bản bàn giao thiết bị.<br>
        <span class="bilingual-text">(Warranty period: 12 months from the date of signing the Delivery/Acceptance Note.)</span><br>
        6.2 Thiết bị cung cấp mới 100%, đúng xuất xứ và tiêu chuẩn kỹ thuật. Đổi mới thiết bị lỗi trong vòng 7 ngày miễn phí.<br>
        <span class="bilingual-text">(Equipment is 100% brand-new, genuine. Free replacement of defective items within 7 days.)</span>
    </div>

    <!-- ĐIỀU 7 -->
    <div class="section-title">Điều 7: ĐIỀU KHOẢN CHUNG <span style="font-weight: normal; text-transform: none; font-size: 13px;" class="bilingual-text">(ARTICLE 7: GENERAL PROVISIONS)</span></div>
    <div style="margin-left: 20px; margin-bottom: 20px;">
        7.1 Mọi sửa đổi, bổ sung hợp đồng phải được lập bằng văn bản có chữ ký đại diện hai bên.<br>
        <span class="bilingual-text">(Any contract modifications must be made in writing signed by authorized representatives of both parties.)</span><br>
        7.2 Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết bằng thương lượng. Trường hợp không tự giải quyết được sẽ đưa ra Tòa án Kinh tế tại Hải Phòng phán xử.<br>
        <span class="bilingual-text">(Disputes shall be settled through negotiation. If failed, the case will be brought to Economic Court in Hai Phong.)</span><br>
        7.3 Hợp đồng này được lập thành hai (02) bản song ngữ Anh - Việt có giá trị pháp lý như nhau. Hợp đồng có hiệu lực kể từ ngày ký.<br>
        <span class="bilingual-text">(This contract is made in 02 bilingual copies with equal legal validity, effective from the date of signing.)</span>
    </div>

    <!-- CHỮ KÝ -->
    <div class="footer-sign">
        <div class="sign-box">
            ĐẠI DIỆN BÊN A<br>
            <span class="bilingual-text">(ON BEHALF OF PARTY A)</span><br><br><br><br><br>
            <strong>${clientName}</strong>
        </div>
        <div class="sign-box">
            ĐẠI DIỆN BÊN B<br>
            <span class="bilingual-text">(ON BEHALF OF PARTY B)</span><br><br><br><br><br>
            <strong>ĐỖ QUANG ANH</strong>
        </div>
    </div>
</body>
</html>`;

    // Save HTML file
    const contractDir = path.join(__dirname, '../uploads/contracts');
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }
    const contractPath = `uploads/contracts/HD-${projectId}.html`;
    const fullPath = path.join(__dirname, '../', contractPath);
    
    fs.writeFileSync(fullPath, contractHtml, 'utf8');

    // Create document record in database
    const fileName = `Hợp đồng kinh tế - HD-${projectId}.html`;
    
    // Check if document already exists
    const existing = await query(
      'SELECT id FROM project_documents WHERE project_id = ? AND file_name = ?',
      [projectId, fileName]
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
         VALUES (?, NULL, ?, ?, ?)`,
        [projectId, fileName, contractPath, creatorId]
      );
    } else {
      await query(
        'UPDATE project_documents SET file_path = ?, created_by = ? WHERE id = ?',
        [contractPath, creatorId, existing[0].id]
      );
    }

    // Log activity
    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [creatorId, 'contract_created', 'project', projectId, JSON.stringify({ file: fileName })]
    );

    // Notify client
    const clientAccountId = await getProjectClientAccountId(projectId);
    if (clientAccountId) {
      await notify([clientAccountId], {
        type: 'contract_created',
        title: 'Hợp đồng kinh tế đã được lập',
        message: `e-Teck đã lập Hợp đồng kinh tế song ngữ cho dự án "${project.title}". Vui lòng kiểm tra và tải về trong tab Báo giá.`,
        related_type: 'project',
        related_id: projectId
      });
    }

    return {
      success: true,
      file_name: fileName,
      file_path: contractPath
    };
  }
};

module.exports = ProjectService;
