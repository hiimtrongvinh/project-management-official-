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

    return { ...project, members };
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
  }
};

module.exports = ProjectService;
