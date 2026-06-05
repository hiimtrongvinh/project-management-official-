const ProjectModel = require('../models/project.model');
const { generateProjectId } = require('../utils/helpers');
const { query } = require('../config/database');
const { getAccountIdByClientId, getProjectMemberAccountIds, getProjectClientAccountId, getAdminAccountIds, notify } = require('../utils/notificationHelpers');

/**
 * Step status labels mapping
 */
const STEP_LABELS = {
  1: 'Khảo sát và lập kế hoạch',
  2: 'Lập báo giá và xác nhận hợp đồng',
  3: 'Triển khai lắp đặt',
  4: 'Bàn giao và nghiệm thu',
  5: 'Thanh toán'
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
    if (data.labor_fee !== undefined) updateData.labor_fee = data.labor_fee;
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
    if (newStep < 1 || newStep > 5) {
      const error = new Error('Step must be between 1 and 5');
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

    // Validate step is 5
    if (project.current_step !== 5) {
      const error = new Error('Project must be at step 5 to close');
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
      current_step: 6
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
    
    // No automatic step advancement - stays in Step 2 until client approves
    
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
    const docx = require('docx');
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } = docx;
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
    const laborFee = parseFloat(project.labor_fee || 0);
    totalValue += laborFee;

    projectItems.forEach(item => {
      const sellPrice = parseFloat(item.material_price || 0) * (1 + parseInt(item.markup || 10) / 100);
      const totalSell = sellPrice * parseInt(item.quantity || 1);
      totalValue += totalSell;
    });

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

    const children = [];

    // Header (National Title)
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Độc lập – Tự do – Hạnh phúc", bold: true, size: 24, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({ text: "(SOCIALIST REPUBLIC OF VIETNAM / Independence – Freedom – Happiness)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Title
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "HỢP ĐỒNG MUA BÁN", bold: true, size: 28, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "PURCHASING CONTRACT", bold: true, size: 24, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({ text: `Số (No.): HD-${projectId}`, italic: true, size: 20, font: "Times New Roman" })
      ]
    }));

    // Preamble
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "- Căn cứ Bộ luật dân sự số: 92/2015/QH13 đã được Quốc hội nước Cộng hòa xã hội chủ nghĩa Việt Nam khóa XIII, kỳ họp thứ 10 thông qua ngày 25 tháng 11 năm 2015", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Based on Civil Law no. 92/2015/QH13 adopted by the 13rd National Assembly of the Social republic of Vietnam at the 10th meeting dated 25th November 2015)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "- Căn cứ Luật Thương mại nước Cộng hòa xã hội chủ nghĩa Việt Nam số 36/2005/QH11", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Based on Trade Law no. 36/2005/QH11 of the Social republic of Vietnam)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "- Căn cứ vào nhu cầu và khả năng đáp ứng của hai bên; (Based on requirement, capacities and agreement of the two concerned parties);", size: 22, font: "Times New Roman" })
      ]
    }));

    // Date
    children.push(new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 240 },
      children: [
        new TextRun({ text: `Hải Phòng, ngày ${day} tháng ${month} năm ${year}   /   Hai Phong, ${today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`, italic: true, size: 22, font: "Times New Roman" })
      ]
    }));

    // Party A
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Bên A: (BÊN MUA): Party A: (THE BUYER):", bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\nĐại diện (Represented by): `, size: 22, font: "Times New Roman" }),
        new TextRun({ text: clientName, bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\nĐịa chỉ (Address): ${clientAddress}`, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\nMST (Tax Code): ${clientTaxCode}      Điện thoại (Phone): ${clientPhone}`, size: 22, font: "Times New Roman" })
      ]
    }));

    // Party B
    children.push(new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "Bên B: (BÊN BÁN): Party B: (THE SUPPLIER):", bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\nCÔNG TY TNHH ĐÀO TẠO VÀ TÍCH HỢP CÔNG NGHỆ E-TECK", bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\nE-TECK TECHNOLOGY INTEGRATION AND TRAINING CO., LTD", bold: true, italic: true, color: "555555", size: 20, font: "Times New Roman" }),
        new TextRun({ text: "\nĐại diện (Represented by): ", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "Ông ĐỖ QUANG ANH", bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: "      Chức vụ (Title): ", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "Giám đốc (Director)", bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\nĐịa chỉ (Address): Số 24 ngõ Đoàn Kết, KDC Thanh Toàn, thôn Vĩnh Khê, xã An Đồng, huyện An Dương, thành phố Hải Phòng`, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\nMST (Tax Code): 0201873815      Điện thoại (Phone): (84) – 225 3601 496`, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\nTài khoản (Account No.): 88688588 tại Ngân hàng ACB – Chi nhánh Duyên Hải`, size: 22, font: "Times New Roman" })
      ]
    }));

    children.push(new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "Sau khi thỏa thuận, hai bên thống nhất ký kết Hợp đồng kinh tế với các điều khoản sau:", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\nAfter negotiation, both parties have agreed to sign the present contract under following terms and conditions:", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Article 1
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 1: NỘI DUNG HỢP ĐỒNG (ARTICLE 1: CONTRACT CONTENT)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "1.1 Bên B sẽ cung cấp hàng hoá cho bên A như được liệt kê tại điều 2 của Hợp đồng này.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Party B will provide all the goods for Party A, as mentioned in the Article 2 of this Contract.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "1.2 Bên B sẽ chịu trách nhiệm vận chuyển đủ hàng hoá như bên A yêu cầu.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Party B will be responsible for transport the Goods as requirements of Party A.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "1.3 Hàng hoá được cung cấp phải đảm bảo là mới 100%, không có lỗi.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Goods must be 100% brand-new without error and the quality of the goods meets the requirements of Party A)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Article 2
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 2: PHẠM VI HỢP ĐỒNG (ARTICLE 2: SCOPE OF THE CONTRACT)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Bên B cung cấp cho bên A danh mục hàng hóa như bảng sau:", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Party B provides the Goods for Party A, detail in the table as follows:)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // TABLE
    const tableRows = [];

    // Header Row
    tableRows.push(new TableRow({
      children: [
        new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "STT (No.)", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 44, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Vật tư / Thiết bị (Material / Equipment)", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ĐVT (Unit)", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SL (Qty)", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Đơn giá (Unit Price)", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Thành tiền (Total)", bold: true, size: 20, font: "Times New Roman" })] })] })
      ]
    }));

    // Item Rows
    projectItems.forEach((item, index) => {
      const sellPrice = parseFloat(item.material_price || 0) * (1 + parseInt(item.markup || 10) / 100);
      const totalSell = sellPrice * parseInt(item.quantity || 1);

      tableRows.push(new TableRow({
        children: [
          new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), size: 20, font: "Times New Roman" })] })] }),
          new TableCell({
            width: { size: 44, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: item.material_name || 'Vật tư', bold: true, size: 20, font: "Times New Roman" }),
                  new TextRun({ text: `\n${item.material_sku || 'SKU-NONE'}`, size: 16, color: "666666", font: "Times New Roman" })
                ]
              })
            ]
          }),
          new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.material_unit || 'cái', size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.quantity || 1), size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${sellPrice.toLocaleString('vi-VN')}đ`, size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${totalSell.toLocaleString('vi-VN')}đ`, bold: true, size: 20, font: "Times New Roman" })] })] })
        ]
      }));
    });

    // Labor Row
    if (laborFee > 0) {
      tableRows.push(new TableRow({
        children: [
          new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(projectItems.length + 1), size: 20, font: "Times New Roman" })] })] }),
          new TableCell({
            width: { size: 44, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Chi phí nhân công triển khai, lắp đặt và thi công", bold: true, size: 20, font: "Times New Roman" }),
                  new TextRun({ text: "\nLABOR-COST", size: 16, color: "666666", font: "Times New Roman" })
                ]
              })
            ]
          }),
          new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "gói", size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1", size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 14, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${laborFee.toLocaleString('vi-VN')}đ`, size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${laborFee.toLocaleString('vi-VN')}đ`, bold: true, size: 20, font: "Times New Roman" })] })] })
        ]
      }));
    }

    // Total Row
    tableRows.push(new TableRow({
      children: [
        new TableCell({
          columnSpan: 5,
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Tổng cộng (Total Contract Value - VAT included):", bold: true, size: 20, font: "Times New Roman" })
              ]
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: `${totalValue.toLocaleString('vi-VN')}đ`, bold: true, size: 20, color: "1d4ed8", font: "Times New Roman" })
              ]
            })
          ]
        })
      ]
    }));

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows
    }));

    // In words and VAT notes
    children.push(new Paragraph({
      spacing: { before: 120, after: 240 },
      children: [
        new TextRun({ text: "Bằng chữ (In words): ", bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: totalWordsVi, bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: ` (${totalWordsEn})`, bold: true, italic: true, color: "555555", size: 20, font: "Times New Roman" }),
        new TextRun({ text: "\nGiá trị hợp đồng đã bao gồm thuế GTGT VAT 10%. Giá trị hợp đồng là giá cố định và đã bao gồm toàn bộ chi phí vận chuyển, đóng gói, bảo hiểm đến địa điểm của Bên A.", size: 22, font: "Times New Roman" })
      ]
    }));

    // Article 3
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 3: ĐIỀU KHOẢN THANH TOÁN (ARTICLE 3: TERM OF PAYMENT)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "3.1 Việc thanh toán sẽ được thực hiện bằng đồng VND thông qua phương thức chuyển khoản.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Payment will be made in VND via bank transfer.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "3.2 Bên A sẽ thanh toán cho Bên B làm 02 đợt:", size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\n+ Đợt 1 (First payment): Đặt cọc 40% giá trị hợp đồng, tương đương số tiền: `, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `${depositAmount.toLocaleString('vi-VN')}đ`, bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: ` (Bằng chữ: ${depositWordsVi} / `, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `${depositWordsEn}`, italic: true, color: "555555", size: 20, font: "Times New Roman" }),
        new TextRun({ text: ") trong vòng 05 ngày kể từ ngày ký hợp đồng.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: `\n+ Đợt 2 (Second payment): Thanh toán 60% giá trị còn lại, tương đương số tiền: `, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `${remainingAmount.toLocaleString('vi-VN')}đ`, bold: true, size: 22, font: "Times New Roman" }),
        new TextRun({ text: ` (Bằng chữ: ${remainingWordsVi} / `, size: 22, font: "Times New Roman" }),
        new TextRun({ text: `${remainingWordsEn}`, italic: true, color: "555555", size: 20, font: "Times New Roman" }),
        new TextRun({ text: ") trong vòng 30 ngày kể từ khi ký biên bản nghiệm thu bàn giao hệ thống.", size: 22, font: "Times New Roman" })
      ]
    }));

    // Article 4
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 4: ĐIỀU KHOẢN PHẠT (ARTICLE 4: PENALTY)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "4.1 Nếu Bên B giao hàng chậm trễ, Bên B sẽ bị phạt 0.5% giá trị hợp đồng cho mỗi ngày chậm trễ. Nếu chậm trễ quá 14 ngày, Bên A có quyền đơn phương chấm dứt hợp đồng và Bên B phải bồi thường 30% giá trị hợp đồng.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(If Party B delays in delivery, Party B shall pay 0.5% of contract value per delayed day. If delay exceeds 14 days, Party A can terminate unilaterally and Party B pays 30% penalty.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "4.2 Nếu Bên A thanh toán chậm trễ, Bên A sẽ chịu phạt 0.5% giá trị chậm thanh toán cho mỗi tuần chậm trễ nhưng tổng phạt không quá 8% giá trị hợp đồng.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(If Party A delays in payment, Party A pays 0.5% of delayed amount per delayed week, capped at 8% total.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Article 5
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 5: GIAO HÀNG (ARTICLE 5: DELIVERY)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "5.1 Thời gian giao hàng: Trong vòng 01-02 tuần kể từ ngày ký hợp đồng và Bên B nhận được thanh toán Đợt 1.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Delivery time: Within 01-02 weeks from signing contract and receiving 1st payment.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "5.2 Chứng từ giao hàng gồm hóa đơn GTGT (VAT) hợp lệ và Biên bản bàn giao hàng hóa.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Delivery documents: Valid VAT invoice and Delivery Note/Acceptance report.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Article 6
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 6: BẢO HÀNH (ARTICLE 6: WARRANTY)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "6.1 Thời gian bảo hành: 12 tháng kể từ ngày ký biên bản bàn giao thiết bị.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Warranty period: 12 months from the date of signing the Delivery/Acceptance Note.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "6.2 Thiết bị cung cấp mới 100%, đúng xuất xứ và tiêu chuẩn kỹ thuật. Đổi mới thiết bị lỗi trong vòng 7 ngày miễn phí.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Equipment is 100% brand-new, genuine. Free replacement of defective items within 7 days.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Article 7
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: "Điều 7: ĐIỀU KHOẢN CHUNG (ARTICLE 7: GENERAL PROVISIONS)", bold: true, size: 22, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "7.1 Mọi sửa đổi, bổ sung hợp đồng phải được lập bằng văn bản có chữ ký đại diện hai bên.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Any contract modifications must be made in writing signed by authorized representatives of both parties.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "7.2 Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết bằng thương lượng. Trường hợp không tự giải quyết được sẽ đưa ra Tòa án Kinh tế tại Hải Phòng phán xử.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(Disputes shall be settled through negotiation. If failed, the case will be brought to Economic Court in Hai Phong.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));
    children.push(new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: "7.3 Hợp đồng này được lập thành hai (02) bản song ngữ Anh - Việt có giá trị pháp lý như nhau. Hợp đồng có hiệu lực kể từ ngày ký.", size: 22, font: "Times New Roman" }),
        new TextRun({ text: "\n(This contract is made in 02 bilingual copies with equal legal validity, effective from the date of signing.)", italic: true, color: "555555", size: 20, font: "Times New Roman" })
      ]
    }));

    // Signatures Table
    children.push(new Table({
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" }
      },
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "ĐẠI DIỆN BÊN A", bold: true, size: 22, font: "Times New Roman" }),
                    new TextRun({ text: "\n(ON BEHALF OF PARTY A)", italic: true, color: "555555", size: 20, font: "Times New Roman" }),
                    new TextRun({ text: `\n\n\n\n\n${clientName}`, bold: true, size: 22, font: "Times New Roman" })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "ĐẠI DIỆN BÊN B", bold: true, size: 22, font: "Times New Roman" }),
                    new TextRun({ text: "\n(ON BEHALF OF PARTY B)", italic: true, color: "555555", size: 20, font: "Times New Roman" }),
                    new TextRun({ text: "\n\n\n\n\nĐỖ QUANG ANH", bold: true, size: 22, font: "Times New Roman" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }));

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    // Save File
    const contractDir = path.join(__dirname, '../uploads/contracts');
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }
    const contractPath = `/uploads/contracts/HD-${projectId}.docx`;
    const fullPath = path.join(contractDir, `HD-${projectId}.docx`);

    fs.writeFileSync(fullPath, buffer);

    // Create document record in database
    const fileName = `Hợp đồng kinh tế - HD-${projectId}.docx`;

    // Check if document already exists (checking both .docx and .html filenames via LIKE)
    const existing = await query(
      "SELECT id, file_name, file_path FROM project_documents WHERE project_id = ? AND (file_name LIKE ? OR file_name LIKE ?)",
      [projectId, `%${projectId}.docx`, `%${projectId}.html`]
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
         VALUES (?, NULL, ?, ?, ?)`,
        [projectId, fileName, contractPath, creatorId]
      );
    } else {
      // Clean up old .html file on disk if it exists
      existing.forEach(doc => {
        if (doc.file_name.endsWith('.html')) {
          const oldFullPath = path.join(__dirname, '..', doc.file_path);
          if (fs.existsSync(oldFullPath)) {
            try { fs.unlinkSync(oldFullPath); } catch (e) { console.error('Lỗi khi xóa file HTML cũ:', e.message); }
          }
        }
      });

      // Update the first document record to be the new docx format
      await query(
        'UPDATE project_documents SET file_name = ?, file_path = ?, created_by = ? WHERE id = ?',
        [fileName, contractPath, creatorId, existing[0].id]
      );

      // If there are duplicate records, delete them
      if (existing.length > 1) {
        const duplicateIds = existing.slice(1).map(doc => doc.id);
        for (const id of duplicateIds) {
          await query('DELETE FROM project_documents WHERE id = ?', [id]);
        }
      }
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
  },

  async createHandoverNote(projectId, creatorId) {
    const fs = require('fs');
    const path = require('path');
    const ExcelJS = require('exceljs');

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
      const error = new Error('No materials found in the project. Please add materials before creating a document.');
      error.statusCode = 400;
      throw error;
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const clientName = project.client_name || 'Họ và tên khách hàng';
    const clientTaxCode = project.client_tax_code || '........................';
    const clientPhone = project.client_phone || '........................';
    const clientAddress = project.client_address || '........................';

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bien ban ban giao');

    worksheet.pageSetup.orientation = 'portrait';
    worksheet.pageSetup.paperSize = 9; // A4

    worksheet.columns = [
      { key: 'stt', width: 6 },
      { key: 'item', width: 48 },
      { key: 'unit', width: 10 },
      { key: 'qty', width: 10 },
      { key: 'remark', width: 15 }
    ];

    // Header info
    worksheet.getCell('C1').value = 'E-TECK TECHNOLOGY INTEGRATION & TRAINING CO., LTD';
    worksheet.getCell('C1').font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell('C2').value = 'CÔNG TY TNHH ĐÀO TẠO VÀ TÍCH HỢP CÔNG NGHỆ E-TECK';
    worksheet.getCell('C2').font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell('C3').value = 'No. 24 Doan Ket lane, Thanh Toan residential area, An Dong, An Duong, Hai Phong';
    worksheet.getCell('C3').font = { name: 'Times New Roman', size: 9, italic: true };
    worksheet.getCell('C4').value = 'Tax Code/MST: 0201873815         Tel: 84-225-3601-496';
    worksheet.getCell('C4').font = { name: 'Times New Roman', size: 9, italic: true };
    worksheet.getCell('C5').value = 'Website: www.e-teck.vn                Email: admin@e-teck.vn';
    worksheet.getCell('C5').font = { name: 'Times New Roman', size: 9, italic: true };

    // Title
    worksheet.mergeCells('A7:E7');
    const titleCell = worksheet.getCell('A7');
    titleCell.value = 'DELIVERY NOTE AND WARRANTY / BIÊN BẢN BÀN GIAO KIÊM BẢO HÀNH';
    titleCell.font = { name: 'Times New Roman', size: 14, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(7).height = 25;

    // Customer & Document Info
    worksheet.getCell('A10').value = 'Customer / Khách hàng:';
    worksheet.getCell('A10').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B10').value = clientName;
    worksheet.getCell('B10').font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell('D10').value = 'No / Số:';
    worksheet.getCell('D10').font = { name: 'Times New Roman', size: 10, italic: true, horizontal: 'right' };
    worksheet.getCell('E10').value = `BB-BG-${projectId}`;
    worksheet.getCell('E10').font = { name: 'Times New Roman', size: 10, bold: true };

    worksheet.getCell('A11').value = 'Address / Địa chỉ:';
    worksheet.getCell('A11').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B11').value = clientAddress;
    worksheet.getCell('B11').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell('D11').value = 'Date / Ngày:';
    worksheet.getCell('D11').font = { name: 'Times New Roman', size: 10, italic: true, horizontal: 'right' };
    worksheet.getCell('E11').value = `${day}/${month}/${year}`;
    worksheet.getCell('E11').font = { name: 'Times New Roman', size: 10, bold: true };

    worksheet.getCell('A12').value = 'Attn / Gửi tới:';
    worksheet.getCell('A12').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B12').value = clientName;
    worksheet.getCell('B12').font = { name: 'Times New Roman', size: 10 };

    worksheet.getCell('A13').value = 'Tel No. / Số điện thoại:';
    worksheet.getCell('A13').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B13').value = clientPhone;
    worksheet.getCell('B13').font = { name: 'Times New Roman', size: 10 };

    // Intro
    worksheet.mergeCells('A15:E15');
    const introCell = worksheet.getCell('A15');
    introCell.value = `Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại trụ sở Công ty........................................... ; chúng tôi tiến hành bàn giao nghiệm thu hàng hóa và dịch vụ dưới đây:`;
    introCell.font = { name: 'Times New Roman', size: 10 };
    introCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    worksheet.getRow(15).height = 30;

    // Table Headers
    const headers = [
      'No.\nSTT',
      'Items\nDanh mục hàng hóa & dịch vụ',
      'Unit\nĐơn Vị',
      'Qty\nSL',
      'Remark\nBảo hành'
    ];
    worksheet.getRow(17).height = 30;
    headers.forEach((h, idx) => {
      const col = String.fromCharCode(65 + idx); // A, B, C, D, E
      const cell = worksheet.getCell(`${col}17`);
      cell.value = h;
      cell.font = { name: 'Times New Roman', size: 10, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    let currentRow = 18;
    projectItems.forEach((item, index) => {
      worksheet.getCell(`A${currentRow}`).value = index + 1;
      worksheet.getCell(`B${currentRow}`).value = item.material_name;
      worksheet.getCell(`C${currentRow}`).value = item.material_unit;
      worksheet.getCell(`D${currentRow}`).value = item.quantity;
      worksheet.getCell(`E${currentRow}`).value = '12 tháng';

      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.font = { name: 'Times New Roman', size: 10 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (col === 'A' || col === 'C' || col === 'D' || col === 'E') {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
      });
      currentRow++;
    });

    // Add labor row if labor_fee > 0
    if (parseFloat(project.labor_fee || 0) > 0) {
      worksheet.getCell(`A${currentRow}`).value = projectItems.length + 1;
      worksheet.getCell(`B${currentRow}`).value = 'Thi công chạy dây điện & hệ thống quang / System cabling & optical installation';
      worksheet.getCell(`C${currentRow}`).value = 'Set / Gói';
      worksheet.getCell(`D${currentRow}`).value = 1;
      worksheet.getCell(`E${currentRow}`).value = '12 tháng';

      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.font = { name: 'Times New Roman', size: 10, bold: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (col === 'A' || col === 'C' || col === 'D' || col === 'E') {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        }
      });
      currentRow++;
    }

    currentRow++; // Empty row spacing

    // Exclusions
    worksheet.getCell(`B${currentRow}`).value = 'Các trường hợp không được bảo hành / Warranty exclusions:';
    worksheet.getCell(`B${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true, underline: true };
    currentRow++;

    const exclusions = [
      '- Các sản phẩm bị biến dạng cơ khí / Mechanically deformed products',
      '- Lỗi do sử dụng thao tác sai kỹ thuật, rơi vỡ, cháy nổ, hỏa hoạn, sự cố điện / Misuse, drops, burns, fire, electrical issues',
      '- Tem bảo hành của công ty hoặc của nhà cung cấp bị rách, sửa đổi, dán đè / Broken, altered, overwritten warranty stamps',
      '- Không có phiếu bảo hành hoặc Phiếu bảo hành bị sửa chữa, tẩy xóa / Missing, repaired, erased warranty card',
      '- Các phụ kiện bị hao mòn trong quá trình sử dụng / Accessories worn out during use'
    ];

    exclusions.forEach(ex => {
      worksheet.getCell(`B${currentRow}`).value = ex;
      worksheet.getCell(`B${currentRow}`).font = { name: 'Times New Roman', size: 9 };
      currentRow++;
    });

    currentRow++; // Spacer

    worksheet.getCell(`B${currentRow}`).value = 'Biên bản này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau. / This Delivery Note & Warranty shall be made into 02 originals. Each Party keeps 01 original.';
    worksheet.getCell(`B${currentRow}`).font = { name: 'Times New Roman', size: 10, italic: true };
    currentRow += 2;

    // Signatures
    worksheet.getCell(`B${currentRow}`).value = "Deliverier's Signature / Chữ ký người giao hàng";
    worksheet.getCell(`B${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };

    worksheet.getCell(`D${currentRow}`).value = "Receiver's Signature / Chữ ký người nhận hàng";
    worksheet.getCell(`D${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`D${currentRow}:E${currentRow}`);

    // Save to file
    const contractDir = path.join(__dirname, '../uploads/contracts');
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }
    const fileName = `Biên bản bàn giao - BB-BG-${projectId}.xlsx`;
    const docPath = `/uploads/contracts/BB-BG-${projectId}.xlsx`;
    const fullPath = path.join(contractDir, `BB-BG-${projectId}.xlsx`);

    await workbook.xlsx.writeFile(fullPath);

    // Database upsert
    const existing = await query(
      'SELECT id FROM project_documents WHERE project_id = ? AND file_name = ?',
      [projectId, fileName]
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
         VALUES (?, NULL, ?, ?, ?)`,
        [projectId, fileName, docPath, creatorId]
      );
    } else {
      await query(
        'UPDATE project_documents SET file_path = ?, created_by = ? WHERE id = ?',
        [docPath, creatorId, existing[0].id]
      );
    }

    // Log Activity
    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [creatorId, 'handover_created', 'project', projectId, JSON.stringify({ file: fileName })]
    );

    // Notify client
    const clientAccountId = await getProjectClientAccountId(projectId);
    if (clientAccountId) {
      await notify([clientAccountId], {
        type: 'project_step_advanced',
        title: 'Biên bản bàn giao & Bảo hành đã được lập',
        message: `e-Teck đã lập Biên bản bàn giao kiêm bảo hành cho dự án "${project.title}". Vui lòng kiểm tra và tải về.`,
        related_type: 'project',
        related_id: projectId
      });
    }

    return {
      success: true,
      file_name: fileName,
      file_path: docPath
    };
  },

  async createAcceptanceNote(projectId, creatorId) {
    const fs = require('fs');
    const path = require('path');
    const ExcelJS = require('exceljs');

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
      const error = new Error('No materials found in the project. Please add materials before creating a document.');
      error.statusCode = 400;
      throw error;
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const clientName = project.client_name || 'Họ và tên khách hàng';
    const clientTaxCode = project.client_tax_code || '........................';
    const clientPhone = project.client_phone || '........................';
    const clientAddress = project.client_address || '........................';

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bien ban nghiem thu');

    worksheet.pageSetup.orientation = 'portrait';
    worksheet.pageSetup.paperSize = 9; // A4

    worksheet.columns = [
      { key: 'stt', width: 6 },
      { key: 'item', width: 35 },
      { key: 'unit', width: 10 },
      { key: 'qty', width: 8 },
      { key: 'price', width: 14 },
      { key: 'total', width: 16 },
      { key: 'remark', width: 12 }
    ];

    // Header info
    worksheet.getCell('C1').value = 'E-TECK TECHNOLOGY INTEGRATION & TRAINING CO., LTD';
    worksheet.getCell('C1').font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell('C2').value = 'CÔNG TY TNHH ĐÀO TẠO VÀ TÍCH HỢN CÔNG NGHỆ E-TECK';
    worksheet.getCell('C2').font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell('C3').value = 'No. 24 Doan Ket lane, Thanh Toan residential area, An Dong, An Duong, Hai Phong';
    worksheet.getCell('C3').font = { name: 'Times New Roman', size: 9, italic: true };
    worksheet.getCell('C4').value = 'Tax Code/MST: 0201873815         Tel: 84-225-3601-496';
    worksheet.getCell('C4').font = { name: 'Times New Roman', size: 9, italic: true };
    worksheet.getCell('C5').value = 'Website: www.e-teck.vn                Email: admin@e-teck.vn';
    worksheet.getCell('C5').font = { name: 'Times New Roman', size: 9, italic: true };

    // Title
    worksheet.mergeCells('A7:G7');
    const titleCell = worksheet.getCell('A7');
    titleCell.value = 'ACCEPTANCE NOTE / BIÊN BẢN NGHIỆM THU';
    titleCell.font = { name: 'Times New Roman', size: 14, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(7).height = 25;

    // Customer & Document Info
    worksheet.getCell('A10').value = 'Customer / Khách hàng:';
    worksheet.getCell('A10').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B10').value = clientName;
    worksheet.getCell('B10').font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell('F10').value = 'No / Số:';
    worksheet.getCell('F10').font = { name: 'Times New Roman', size: 10, italic: true, horizontal: 'right' };
    worksheet.getCell('G10').value = `BB-NT-${projectId}`;
    worksheet.getCell('G10').font = { name: 'Times New Roman', size: 10, bold: true };

    worksheet.getCell('A11').value = 'Address / Địa chỉ:';
    worksheet.getCell('A11').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B11').value = clientAddress;
    worksheet.getCell('B11').font = { name: 'Times New Roman', size: 10 };
    worksheet.getCell('F11').value = 'Date / Ngày:';
    worksheet.getCell('F11').font = { name: 'Times New Roman', size: 10, italic: true, horizontal: 'right' };
    worksheet.getCell('G11').value = `${day}/${month}/${year}`;
    worksheet.getCell('G11').font = { name: 'Times New Roman', size: 10, bold: true };

    worksheet.getCell('A12').value = 'Attn / Gửi tới:';
    worksheet.getCell('A12').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B12').value = clientName;
    worksheet.getCell('B12').font = { name: 'Times New Roman', size: 10 };

    worksheet.getCell('A13').value = 'Tel No. / Số điện thoại:';
    worksheet.getCell('A13').font = { name: 'Times New Roman', size: 10, italic: true };
    worksheet.getCell('B13').value = clientPhone;
    worksheet.getCell('B13').font = { name: 'Times New Roman', size: 10 };

    // Intro
    worksheet.mergeCells('A15:G15');
    const introCell = worksheet.getCell('A15');
    introCell.value = `Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại trụ sở CÔNG TY......................................................................................; chúng tôi tiến hành bàn giao nghiệm thu hàng hóa và dịch vụ dưới đây:`;
    introCell.font = { name: 'Times New Roman', size: 10 };
    introCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    worksheet.getRow(15).height = 30;

    // Table Headers
    const headers = [
      'No.\nSTT',
      'Items\nDanh mục hàng hóa & dịch vụ',
      'Unit\nĐơn Vị',
      'Qty\nSL',
      'Unit Price\nĐơn Giá',
      'Sub Total\nThành Tiền',
      'Warranty\nBảo Hành'
    ];
    worksheet.getRow(17).height = 30;
    headers.forEach((h, idx) => {
      const col = String.fromCharCode(65 + idx); // A, B, C, D, E, F, G
      const cell = worksheet.getCell(`${col}17`);
      cell.value = h;
      cell.font = { name: 'Times New Roman', size: 10, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    let totalContractValue = 0;
    let currentRow = 18;
    projectItems.forEach((item, index) => {
      const unitPrice = parseFloat(item.material_price || 0) * (1 + parseInt(item.markup || 10) / 100);
      const amount = unitPrice * parseInt(item.quantity || 1);
      totalContractValue += amount;

      worksheet.getCell(`A${currentRow}`).value = index + 1;
      worksheet.getCell(`B${currentRow}`).value = item.material_name;
      worksheet.getCell(`C${currentRow}`).value = item.material_unit;
      worksheet.getCell(`D${currentRow}`).value = item.quantity;
      worksheet.getCell(`E${currentRow}`).value = unitPrice;
      worksheet.getCell(`F${currentRow}`).value = amount;
      worksheet.getCell(`G${currentRow}`).value = '12 tháng';

      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.font = { name: 'Times New Roman', size: 10 };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (col === 'E' || col === 'F') {
          cell.numFmt = '#,##0"đ"';
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
        } else if (col === 'B') {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
      currentRow++;
    });

    // Add labor row if labor_fee > 0
    const laborFee = parseFloat(project.labor_fee || 0);
    if (laborFee > 0) {
      totalContractValue += laborFee;

      worksheet.getCell(`A${currentRow}`).value = projectItems.length + 1;
      worksheet.getCell(`B${currentRow}`).value = 'Thi công chạy dây điện & hệ thống quang / System cabling & optical installation';
      worksheet.getCell(`C${currentRow}`).value = 'Set / Gói';
      worksheet.getCell(`D${currentRow}`).value = 1;
      worksheet.getCell(`E${currentRow}`).value = laborFee;
      worksheet.getCell(`F${currentRow}`).value = laborFee;
      worksheet.getCell(`G${currentRow}`).value = '12 tháng';

      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
        const cell = worksheet.getCell(`${col}${currentRow}`);
        cell.font = { name: 'Times New Roman', size: 10, bold: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (col === 'E' || col === 'F') {
          cell.numFmt = '#,##0"đ"';
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
        } else if (col === 'B') {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
      });
      currentRow++;
    }

    // Grand total row
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = 'Grand Total Price / Tổng tiền thanh toán (VND):';
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(`A${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell(`A${currentRow}`).border = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };

    worksheet.getCell(`F${currentRow}`).value = totalContractValue;
    worksheet.getCell(`F${currentRow}`).numFmt = '#,##0"đ"';
    worksheet.getCell(`F${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(`F${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true, color: { argb: 'FF1D4ED8' } };
    worksheet.getCell(`F${currentRow}`).border = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };

    worksheet.getCell(`G${currentRow}`).border = {
      top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
    };
    currentRow++;

    currentRow++; // spacing

    // Evaluation notes
    const notes = [
      '* Về khối lượng / Quantity:',
      '  - Đầy đủ chủng loại / Full varieties',
      '  - Đúng chủng loại / Correct varieties',
      '',
      '* Về chất lượng thiết bị, vật tư / Equipment & Material Quality:',
      '  - Đạt yêu cầu / Meets requirements',
      '',
      '* Về lắp đặt thiết bị, vật tư / Installation:',
      '  - Đạt yêu cầu / Meets requirements',
      '',
      '* Cài đặt, đưa thiết bị vào hoạt động / Commissioning:',
      '  - Thiết bị hoạt động bình thường / Equipment operates normally',
      '',
      '* Kết luận / Conclusion:',
      '  - Chấp nhận nghiệm thu sản phẩm để sử dụng / Accept products for use.'
    ];

    notes.forEach(note => {
      worksheet.getCell(`B${currentRow}`).value = note;
      worksheet.getCell(`B${currentRow}`).font = {
        name: 'Times New Roman',
        size: 10,
        bold: note.startsWith('*')
      };
      currentRow++;
    });

    currentRow++; // spacer

    worksheet.getCell(`B${currentRow}`).value = 'Biên bản này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau. / This Acceptance Note shall be made into 02 originals. Each Party keeps 01 original.';
    worksheet.getCell(`B${currentRow}`).font = { name: 'Times New Roman', size: 10, italic: true };
    currentRow += 2;

    // Signatures
    worksheet.getCell(`B${currentRow}`).value = "Deliverier's Signature / Chữ ký người giao hàng";
    worksheet.getCell(`B${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };

    worksheet.getCell(`F${currentRow}`).value = "Receiver's Signature / Chữ ký người nhận hàng";
    worksheet.getCell(`F${currentRow}`).font = { name: 'Times New Roman', size: 10, bold: true };
    worksheet.getCell(`F${currentRow}`).alignment = { horizontal: 'center' };
    worksheet.mergeCells(`F${currentRow}:G${currentRow}`);

    // Save to file
    const contractDir = path.join(__dirname, '../uploads/contracts');
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }
    const fileName = `Biên bản nghiệm thu - BB-NT-${projectId}.xlsx`;
    const docPath = `/uploads/contracts/BB-NT-${projectId}.xlsx`;
    const fullPath = path.join(contractDir, `BB-NT-${projectId}.xlsx`);

    await workbook.xlsx.writeFile(fullPath);

    // Database upsert
    const existing = await query(
      'SELECT id FROM project_documents WHERE project_id = ? AND file_name = ?',
      [projectId, fileName]
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
         VALUES (?, NULL, ?, ?, ?)`,
        [projectId, fileName, docPath, creatorId]
      );
    } else {
      await query(
        'UPDATE project_documents SET file_path = ?, created_by = ? WHERE id = ?',
        [docPath, creatorId, existing[0].id]
      );
    }

    // Log Activity
    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [creatorId, 'acceptance_created', 'project', projectId, JSON.stringify({ file: fileName })]
    );

    // Notify client
    const clientAccountId = await getProjectClientAccountId(projectId);
    if (clientAccountId) {
      await notify([clientAccountId], {
        type: 'project_step_advanced',
        title: 'Biên bản nghiệm thu đã được lập',
        message: `e-Teck đã lập Biên bản nghiệm thu cho dự án "${project.title}". Vui lòng kiểm tra và tải về.`,
        related_type: 'project',
        related_id: projectId
      });
    }

    return {
      success: true,
      file_name: fileName,
      file_path: docPath
    };
  },

  async createPaymentRequest(projectId, creatorId) {
    const fs = require('fs');
    const path = require('path');
    const docx = require('docx');
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = docx;
    const { convertVNDToWords, convertVNDToWordsEn } = require('../utils/numberToWords');

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Fetch project materials/items to calculate totalValue
    const projectItems = await query(
      `SELECT pi.*, m.name as material_name, m.sku as material_sku, m.unit as material_unit, m.price as material_price
       FROM project_items pi
       LEFT JOIN materials m ON pi.material_id = m.id
       WHERE pi.project_id = ?`,
      [projectId]
    );

    let totalValue = 0;
    const laborFee = parseFloat(project.labor_fee || 0);
    totalValue += laborFee;

    projectItems.forEach(item => {
      const sellPrice = parseFloat(item.material_price || 0) * (1 + parseInt(item.markup || 10) / 100);
      const totalSell = sellPrice * parseInt(item.quantity || 1);
      totalValue += totalSell;
    });

    const paymentAmount = Math.round(totalValue);
    const amountWordsVi = convertVNDToWords(paymentAmount);
    const amountWordsEn = convertVNDToWordsEn(paymentAmount);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const monthsEnglish = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthEn = monthsEnglish[today.getMonth()];

    const clientName = project.client_name || 'Họ và tên khách hàng';
    const clientTaxCode = project.client_tax_code || '........................';
    const clientPhone = project.client_phone || '........................';
    const clientAddress = project.client_address || '........................';

    // Word Document generation
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // National Title (Centered)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "SOCIALIST REPUBLIC OF VIETNAM", bold: true, size: 24, font: "Times New Roman" }),
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 360 },
              children: [
                new TextRun({ text: "Independence – Freedom - Happiness", bold: true, size: 24, font: "Times New Roman" }),
              ]
            }),

            // Title (Centered)
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 360 },
              children: [
                new TextRun({ text: "PAYMENT REQUEST", bold: true, size: 28, font: "Times New Roman" }),
              ]
            }),

            // Dear
            new Paragraph({
              spacing: { after: 180 },
              children: [
                new TextRun({ text: "Dear: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: clientName, bold: true, size: 24, font: "Times New Roman" }),
              ]
            }),

            // Address
            new Paragraph({
              spacing: { after: 180 },
              children: [
                new TextRun({ text: "Địa chỉ: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: clientAddress, size: 24, font: "Times New Roman" }),
              ]
            }),

            // Tax Code
            new Paragraph({
              spacing: { after: 240 },
              children: [
                new TextRun({ text: "MST: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: clientTaxCode, size: 24, font: "Times New Roman" }),
              ]
            }),

            // Regarding and request amount
            new Paragraph({
              spacing: { after: 240 },
              children: [
                new TextRun({ text: `Regarding the Contract No. HD-${projectId}, we respectfully request the payment: `, size: 24, font: "Times New Roman" }),
                new TextRun({ text: `${paymentAmount.toLocaleString('vi-VN')} đồng `, bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: `(${paymentAmount.toLocaleString('vi-VN')} VND / In words: ${amountWordsVi} / ${amountWordsEn} USD).`, italic: true, size: 24, font: "Times New Roman" }),
              ]
            }),

            // Account Name
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "- Account Name: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: "CÔNG TY TNHH ĐÀO TẠO VÀ TÍCH HỢP CÔNG NGHỆ E-TECK", size: 24, font: "Times New Roman" }),
              ]
            }),

            // Account Number
            new Paragraph({
              spacing: { after: 240 },
              children: [
                new TextRun({ text: "- Account Number: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: "88688588 at ACB, Duyen Hai branch", size: 24, font: "Times New Roman" }),
              ]
            }),

            // Closing
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "Looking forward to receiving cooperation from you.", size: 24, font: "Times New Roman" }),
              ]
            }),
            new Paragraph({
              spacing: { after: 480 },
              children: [
                new TextRun({ text: "We sincerely thank you!", bold: true, size: 24, font: "Times New Roman" }),
              ]
            }),

            // Date (Right Aligned)
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 480 },
              children: [
                new TextRun({ text: `Hai Phong, ${monthEn} ${day}, ${year}`, italic: true, size: 24, font: "Times New Roman" }),
              ]
            }),
          ]
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    // Save File
    const contractDir = path.join(__dirname, '../uploads/contracts');
    if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir, { recursive: true });
    }
    const fileName = `Đề nghị thanh toán - DN-TT-${projectId}.docx`;
    const docPath = `/uploads/contracts/DN-TT-${projectId}.docx`;
    const fullPath = path.join(contractDir, `DN-TT-${projectId}.docx`);

    fs.writeFileSync(fullPath, buffer);

    // Database upsert
    const existing = await query(
      'SELECT id FROM project_documents WHERE project_id = ? AND file_name = ?',
      [projectId, fileName]
    );

    if (existing.length === 0) {
      await query(
        `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
         VALUES (?, NULL, ?, ?, ?)`,
        [projectId, fileName, docPath, creatorId]
      );
    } else {
      await query(
        'UPDATE project_documents SET file_path = ?, created_by = ? WHERE id = ?',
        [docPath, creatorId, existing[0].id]
      );
    }

    // Log Activity
    await query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [creatorId, 'payment_request_created', 'project', projectId, JSON.stringify({ file: fileName })]
    );

    // Notify client
    const clientAccountId = await getProjectClientAccountId(projectId);
    if (clientAccountId) {
      await notify([clientAccountId], {
        type: 'project_step_advanced',
        title: `Đề nghị thanh toán đã được lập`,
        message: `e-Teck đã lập Đề nghị thanh toán cho dự án "${project.title}". Vui lòng kiểm tra và thực hiện thanh toán.`,
        related_type: 'project',
        related_id: projectId
      });
    }

    return {
      success: true,
      file_name: fileName,
      file_path: docPath
    };
  }
};

module.exports = ProjectService;
