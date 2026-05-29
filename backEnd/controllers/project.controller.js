const ProjectService = require('../services/project.service');
const { getAdminAccountIds, notify } = require('../utils/notificationHelpers');

/**
 * Project Controller - HTTP request handlers for project management
 */
const ProjectController = {
  /**
   * GET /api/projects
   * Get all projects with role-based filtering.
   * Admin sees all, Staff sees assigned, Client sees own.
   */
  async getProjects(req, res, next) {
    try {
      const { id, role } = req.user;
      const filters = {
        status: req.query.status,
        category: req.query.category,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await ProjectService.getProjects(filters, id, role);

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/projects/:id
   * Get a single project by ID with role-based access check.
   */
  async getProjectById(req, res, next) {
    try {
      const { id, role } = req.user;
      const projectId = req.params.id;

      const project = await ProjectService.getProjectById(projectId, id, role);

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/projects
   * Create a new project. Admin only.
   */
  async createProject(req, res, next) {
    try {
      const { id: creatorId } = req.user;
      const { title, description, category, clientId, startDate, endDate } = req.body;

      const project = await ProjectService.createProject(
        { title, description, category, clientId, startDate, endDate },
        creatorId
      );

      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/projects/request
   * Client submits a project request.
   */
  async requestProject(req, res, next) {
    try {
      const { id: creatorId, role } = req.user;

      // Lấy client_id từ account
      let clientId = null;
      if (role === 'client') {
        const { query } = require('../config/database');
        const rows = await query('SELECT id FROM clients WHERE account_id = ?', [creatorId]);
        clientId = rows.length > 0 ? rows[0].id : null;
      }

      const { title, description, serviceType, deadline, budget } = req.body;

      const project = await ProjectService.createProject(
        {
          title,
          description: description || null,
          category: serviceType || null,
          clientId,
          startDate: null,
          endDate: deadline || null,
          currentStep: 0
        },
        creatorId
      );

      res.status(201).json({
        success: true,
        data: project
      });

      // Thông báo cho admin: khách hàng gửi yêu cầu mới
      const adminIds = await getAdminAccountIds();
      notify(adminIds, {
        type: 'client_request_new',
        title: 'Yêu cầu mới từ khách hàng',
        message: `Khách hàng đã gửi yêu cầu: "${title}".`,
        related_type: 'project',
        related_id: project.id
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/projects/:id
   * Update a project. Admin only.
   */
  async updateProject(req, res, next) {
    try {
      const projectId = req.params.id;
      const updateData = req.body;

      const project = await ProjectService.updateProject(projectId, updateData);

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/projects/:id
   * Delete a project. Admin only. CASCADE handles related records.
   */
  async deleteProject(req, res, next) {
    try {
      const projectId = req.params.id;

      await ProjectService.deleteProject(projectId);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/projects/:id/members
   * Add a member to a project. Admin only.
   * Body: { staffId, role }
   */
  async addMember(req, res, next) {
    try {
      const projectId = req.params.id;
      const { staffId, role } = req.body;

      if (!staffId) {
        return res.status(400).json({
          success: false,
          error: { message: 'staffId is required' }
        });
      }

      const members = await ProjectService.addMember(projectId, staffId, role);

      res.status(201).json({
        success: true,
        data: members
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/projects/:id/members/:staffId
   * Remove a member from a project. Admin only.
   */
  async removeMember(req, res, next) {
    try {
      const projectId = req.params.id;
      const { staffId } = req.params;

      const members = await ProjectService.removeMember(projectId, staffId);

      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/projects/:id/status
   * Update project status (advance step). Admin only.
   * Body: { step }
   */
  async updateStatus(req, res, next) {
    try {
      const projectId = req.params.id;
      const { step } = req.body;

      if (step === undefined || step === null) {
        return res.status(400).json({
          success: false,
          error: { message: 'step is required' }
        });
      }

      const project = await ProjectService.updateStatus(projectId, parseInt(step));

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },
  
  /**
   * PUT /api/projects/:id/close
   * Close a project. Admin only.
   */
  async closeProject(req, res, next) {
    try {
      const projectId = req.params.id;
      const project = await ProjectService.closeProject(projectId);
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/projects/:id/quotation-status
   * Client approves or rejects the project quotation.
   */
  async updateQuotationStatus(req, res, next) {
    try {
      const projectId = req.params.id;
      const { status } = req.body; // 'approved' or 'rejected'

      const project = await ProjectService.getProjectById(projectId, req.user.id, req.user.role);
      
      if (status === 'approved') {
        // Advance step to 4 (Triển khai lắp đặt)
        await ProjectService.updateProject(projectId, { current_step: 4 });
        
        // Notify admins
        const adminIds = await getAdminAccountIds();
        await notify(adminIds, {
          type: 'quotation_approved',
          title: 'Báo giá đã được khách hàng phê duyệt',
          message: `Khách hàng đã phê duyệt báo giá cho dự án "${project.title}". Dự án tự động chuyển sang Bước 4 (Triển khai lắp đặt).`,
          related_type: 'project',
          related_id: projectId
        });
      } else if (status === 'rejected') {
        // Notify admins of rejection
        const adminIds = await getAdminAccountIds();
        await notify(adminIds, {
          type: 'quotation_rejected',
          title: 'Báo giá bị khách hàng từ chối',
          message: `Khách hàng đã từ chối báo giá cho dự án "${project.title}".`,
          related_type: 'project',
          related_id: projectId
        });
      }

      res.json({
        success: true,
        message: `Đã cập nhật trạng thái báo giá thành: ${status}`
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  async sendQuotation(req, res, next) {
    try {
      const projectId = req.params.id;
      const project = await ProjectService.sendQuotation(projectId, req.user.id);
      res.json({
        success: true,
        data: project,
        message: 'Báo giá đã được gửi thành công đến Khách hàng!'
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  async createContract(req, res, next) {
    try {
      const projectId = req.params.id;
      const result = await ProjectService.createContract(projectId, req.user.id);
      res.json({
        success: true,
        data: result,
        message: 'Hợp đồng kinh tế đã được lập thành công!'
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  }
};

module.exports = ProjectController;
