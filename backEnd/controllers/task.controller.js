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
          files.push({
            file_name: file.originalname,
            file_path: `/uploads/${subfolder}/${file.filename}`
          });
        });
      } else if (req.file) {
        const subfolder = req.file.mimetype.startsWith('image/') ? 'images' : 'documents';
        files.push({
          file_name: req.file.originalname,
          file_path: `/uploads/${subfolder}/${req.file.filename}`
        });
      }

      const filePaths = files.map(f => f.file_path);

      const submitData = {
        files: files,
        file_paths: filePaths,
        file_path: filePaths.length > 0 ? filePaths[0] : req.body.file_path || '', // Keep file_path for backward compatibility
        note: req.body.note || '',
        accountId: req.user.id
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
  }
};

module.exports = TaskController;
