const TaskService = require('../services/task.service');

/**
 * Task Controller - HTTP request handlers for task management
 */
const TaskController = {
  /**
   * GET /api/tasks/project/:projectId
   * Get all tasks for a project.
   */
  async getTasksByProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const tasks = await TaskService.getTasksByProject(projectId);
      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/tasks/my-tasks
   * Get tasks assigned to the logged-in user.
   */
  async getMyTasks(req, res, next) {
    try {
      const tasks = await TaskService.getMyTasks(req.user.id, req.user.role);
      res.json({
        success: true,
        data: tasks
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
   * GET /api/tasks/:id
   * Get a single task by ID.
   */
  async getTaskById(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const task = await TaskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: { message: 'Task not found' }
        });
      }
      res.json({
        success: true,
        data: task
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
   * POST /api/tasks/:id/submit
   * Submit work report/deliverables for a task.
   */
  async submitTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      console.log('TaskController.submitTask: taskId =', taskId, 'req.files =', req.files ? req.files.length : 'none', 'req.file =', req.file ? 'yes' : 'no');
      
      const files = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const subfolder = file.mimetype.startsWith('image/') ? 'images' : 'documents';
          const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
          files.push({
            file_name: originalName,
            file_path: `/uploads/${subfolder}/${file.filename}`
          });
        });
      } else if (req.file) {
        const subfolder = req.file.mimetype.startsWith('image/') ? 'images' : 'documents';
        const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        files.push({
          file_name: originalName,
          file_path: `/uploads/${subfolder}/${req.file.filename}`
        });
      }

      // Encrypt files immediately after Multer saved them to disk
      const { encryptFileInPlace } = require('../utils/cryptoHelpers');
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          encryptFileInPlace(file.path);
        });
      } else if (req.file) {
        encryptFileInPlace(req.file.path);
      }

      const filePaths = files.map(f => f.file_path);

      const submitData = {
        files: files,
        file_paths: filePaths,
        file_path: filePaths.length > 0 ? filePaths[0] : req.body.file_path || '', // Keep file_path for backward compatibility
        note: req.body.note || '',
        accountId: req.user.id,
        role: req.user.role
      };

      await TaskService.submitTask(taskId, submitData);
      res.json({
        success: true,
        message: 'Task submitted successfully.'
      });
    } catch (error) {
      console.error('TaskController.submitTask Error:', error.message, error.stack);
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
   * POST /api/tasks/:id/review
   * Review/approve a task submission.
   */
  async reviewTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const { status, feedback } = req.body;

      if (!['Đã duyệt', 'Cần sửa'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid status. Status must be "Đã duyệt" or "Cần sửa".' }
        });
      }

      const reviewData = {
        status,
        feedback: feedback || '',
        accountId: req.user.id
      };

      await TaskService.reviewTask(taskId, reviewData);
      res.json({
        success: true,
        message: `Task review completed. Status: ${status}`
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
   * POST /api/tasks
   */
  async createTask(req, res, next) {
    try {
      const task = await TaskService.createTask(req.body, req.user.id);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, error: { message: error.message } });
      }
      next(error);
    }
  },

  /**
   * PUT /api/tasks/:id
   */
  async updateTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const task = await TaskService.updateTask(taskId, req.body);
      res.json({ success: true, data: task });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, error: { message: error.message } });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/tasks/:id
   */
  async deleteTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      await TaskService.deleteTask(taskId);
      res.json({ success: true, data: { message: 'Task deleted successfully' } });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, error: { message: error.message } });
      }
      next(error);
    }
  },

  /**
   * GET /api/tasks/download-secure
   * Securely decrypt and serve project files (contract, task attachments, etc.)
   */
  async downloadSecureFile(req, res, next) {
    try {
      const relativePath = req.query.path;
      if (!relativePath) {
        return res.status(400).json({ success: false, error: { message: 'Path is required.' } });
      }

      const path = require('path');
      const fs = require('fs');

      // Prevent directory traversal attacks
      const normalizedPath = path.normalize(relativePath).replace(/^(\.\.(\/|\\))+/, '');

      // Query database to find which project this file belongs to
      const { query } = require('../config/database');
      const docRows = await query(
        'SELECT project_id FROM project_documents WHERE file_path = ?',
        [relativePath]
      );

      if (docRows.length === 0) {
        return res.status(404).json({ success: false, error: { message: 'Tài liệu không tồn tại hoặc không hợp lệ.' } });
      }

      const projectId = docRows[0].project_id;
      const { id: userId, role } = req.user;

      let hasAccess = false;
      if (role === 'admin') {
        hasAccess = true;
      } else if (role === 'staff') {
        const StaffModel = require('../models/staff.model');
        const staff = await StaffModel.findByAccountId(userId);
        if (staff) {
          const memberRows = await query(
            'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
            [projectId, staff.id]
          );
          if (memberRows.length > 0) {
            hasAccess = true;
          }
        }
      } else if (role === 'client') {
        const ClientModel = require('../models/client.model');
        const client = await ClientModel.findByAccountId(userId);
        if (client) {
          const projectRows = await query(
            'SELECT client_id FROM projects WHERE id = ?',
            [projectId]
          );
          if (projectRows.length > 0 && projectRows[0].client_id === client.id) {
            hasAccess = true;
          }
        }
      }

      if (!hasAccess) {
        return res.status(403).json({ success: false, error: { message: 'Bạn không có quyền truy cập tài liệu này.' } });
      }

      // Resolve full path on disk
      const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
      const fullDiskPath = path.join(process.cwd(), cleanPath);

      if (!fs.existsSync(fullDiskPath)) {
        return res.status(404).json({ success: false, error: { message: 'Tệp tin không tồn tại trên hệ thống.' } });
      }

      // Decrypt on the fly
      const { decryptFileToBuffer } = require('../utils/cryptoHelpers');
      const decryptedData = decryptFileToBuffer(fullDiskPath);

      // Simple MIME type resolver
      const ext = fullDiskPath.split('.').pop().toLowerCase();
      const mimes = {
        'pdf': 'application/pdf',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'png': 'image/png',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'webp': 'image/webp',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        'dwg': 'application/octet-stream'
      };
      const contentType = mimes[ext] || 'application/octet-stream';
      const fileName = path.basename(fullDiskPath);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(fileName)}"`);
      res.send(decryptedData);

    } catch (error) {
      console.error('Error downloading secure file:', error);
      next(error);
    }
  }
};

module.exports = TaskController;
