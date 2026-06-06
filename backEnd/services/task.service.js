const TaskModel = require('../models/task.model');
const StaffModel = require('../models/staff.model');
const ProjectModel = require('../models/project.model');
const { getAccountIdByStaffId, getAdminAccountIds, notify } = require('../utils/notificationHelpers');

/**
 * Task Service - Business logic for task management
 */
const TaskService = {
  async getTasksByProject(projectId) {
    return TaskModel.findByProjectId(projectId);
  },

  async getMyTasks(accountId, role) {
    if (role === 'admin') {
      return TaskModel.findAll();
    }
    const staff = await StaffModel.findByAccountId(accountId);
    if (!staff) {
      const error = new Error('Staff record not found');
      error.statusCode = 404;
      throw error;
    }
    return TaskModel.findByAssigneeId(staff.id);
  },

  async getTaskById(id) {
    return TaskModel.findById(id);
  },

  async submitTask(id, submitData) {
    console.log('TaskService.submitTask called. id =', id, 'submitData =', JSON.stringify(submitData));
    const task = await TaskModel.findById(id);
    console.log('TaskService.submitTask findById result:', task ? 'found' : 'null');
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = task.status;
    const newStatus = 'Đã nộp';

    await TaskModel.update(id, {
      status: newStatus
    });

    const { query } = require('../config/database');

    // Delete old task files from disk and database (replace old files with new ones)
    try {
      const oldDocs = await query(
        'SELECT file_path FROM project_documents WHERE task_id = ?',
        [id]
      );
      const path = require('path');
      const fs = require('fs');
      for (const doc of oldDocs) {
        if (doc.file_path) {
          const relativePath = doc.file_path.startsWith('/') ? doc.file_path.slice(1) : doc.file_path;
          const fullDiskPath = path.join(process.cwd(), relativePath);
          if (fs.existsSync(fullDiskPath)) {
            fs.unlinkSync(fullDiskPath);
            console.log('Deleted old task file from disk:', fullDiskPath);
          }
        }
      }
    } catch (err) {
      console.error('Error deleting old task files from disk:', err.message);
    }

    await query('DELETE FROM project_documents WHERE task_id = ?', [id]);

    if (submitData.files && submitData.files.length > 0) {
      for (const fileObj of submitData.files) {
        await query(
          `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
           VALUES (?, ?, ?, ?, ?)`,
          [task.project_id, id, fileObj.file_name, fileObj.file_path, submitData.accountId]
        );
      }
    } else if (submitData.file_paths && submitData.file_paths.length > 0) {
      for (const filePath of submitData.file_paths) {
        const fileName = filePath.split('/').pop();
        await query(
          `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
           VALUES (?, ?, ?, ?, ?)`,
          [task.project_id, id, fileName, filePath, submitData.accountId]
        );
      }
    } else if (submitData.file_path) {
      const fileName = submitData.file_path.split('/').pop();
      await query(
        `INSERT INTO project_documents (project_id, task_id, file_name, file_path, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        [task.project_id, id, fileName, submitData.file_path, submitData.accountId]
      );
    }

    await TaskModel.logHistory({
      task_id: id,
      action: 'Nộp báo cáo',
      old_status: oldStatus,
      new_status: newStatus,
      note: submitData.note || 'Nộp báo cáo kết quả công việc.',
      performed_by: submitData.accountId
    });

    // Thông báo cho admin: staff đã nộp báo cáo
    const adminIds = await getAdminAccountIds();
    notify(adminIds, {
      type: 'task_submitted',
      title: 'Có báo cáo mới cần duyệt',
      message: `Công việc "${task.title}" đã được nộp báo cáo.`,
      related_type: 'task',
      related_id: String(id)
    });
  },

  async reviewTask(id, reviewData) {
    const task = await TaskModel.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    const oldStatus = task.status;
    const newStatus = reviewData.status;

    await TaskModel.update(id, {
      status: newStatus
    });

    if (reviewData.feedback) {
      await TaskModel.addNote(id, reviewData.feedback, reviewData.accountId);
    }

    await TaskModel.logHistory({
      task_id: id,
      action: newStatus === 'Đã duyệt' ? 'Duyệt báo cáo' : 'Yêu cầu sửa đổi',
      old_status: oldStatus,
      new_status: newStatus,
      note: reviewData.feedback || (newStatus === 'Đã duyệt' ? 'Duyệt báo cáo.' : 'Yêu cầu chỉnh sửa báo cáo.'),
      performed_by: reviewData.accountId
    });

    // Thông báo cho staff: công việc được duyệt hoặc yêu cầu sửa
    if (task.assignee_id) {
      const assigneeAccountId = await getAccountIdByStaffId(task.assignee_id);
      if (assigneeAccountId) {
        const notiType = newStatus === 'Đã duyệt' ? 'task_approved' : 'task_rejected';
        const notiTitle = newStatus === 'Đã duyệt' ? 'Công việc đã được phê duyệt' : 'Công việc cần chỉnh sửa';
        const notiMsg = newStatus === 'Đã duyệt'
          ? `Công việc "${task.title}" đã được phê duyệt.`
          : `Công việc "${task.title}" cần chỉnh sửa: ${reviewData.feedback || ''}`;
        notify([assigneeAccountId], {
          type: notiType, title: notiTitle, message: notiMsg,
          related_type: 'task', related_id: String(id)
        });
      }
    }

    // Tự động chuyển bước dự án: quét từ bước hiện tại, bước nào duyệt hết thì nhảy qua
    if (newStatus === 'Đã duyệt') {
      const ProjectService = require('./project.service');
      const { query } = require('../config/database');

      let project = await ProjectModel.findById(task.project_id);
      if (project && project.current_step < 5) {
        let step = project.current_step;
        while (step < 5) {
          const stepTasks = await query(
            'SELECT id, status FROM tasks WHERE project_id = ? AND step = ?',
            [task.project_id, step]
          );
          const allApproved = stepTasks.length === 0 || stepTasks.every(t => t.status === 'Đã duyệt');
          if (!allApproved) break;

          // Chuyển sang bước tiếp theo
          try {
            await ProjectService.updateStatus(task.project_id, step + 1);
            step++;
          } catch (e) {
            console.error('Auto advance step failed:', e.message);
            break;
          }
        }
      }

      // Cập nhật progress
      await ProjectService.calculateProgress(task.project_id);
    }
  },

  /**
   * Create a new task for a project.
   */
  async createTask(data, accountId) {
    if (!data.project_id || !data.title || !data.step) {
      const error = new Error('project_id, title, and step are required');
      error.statusCode = 400;
      throw error;
    }

    if (data.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(data.deadline) < today) {
        const error = new Error('Hạn chót công việc không được trước ngày hiện tại');
        error.statusCode = 400;
        throw error;
      }
    }

    const { query } = require('../config/database');
    const projectRows = await query(
      "SELECT id FROM projects WHERE id = ?",
      [data.project_id]
    );
    if (projectRows.length === 0) {
      const error = new Error('Dự án không tồn tại.');
      error.statusCode = 400;
      throw error;
    }

    const taskId = await TaskModel.create({
      project_id: data.project_id,
      step: data.step,
      title: data.title,
      description: data.description || null,
      assignee_id: data.assignee_id || null,
      deadline: data.deadline || null,
      priority: data.priority || 'Trung bình',
      status: 'Chưa nộp'
    });

    await TaskModel.logHistory({
      task_id: taskId,
      action: 'Tạo công việc',
      old_status: null,
      new_status: 'Chưa nộp',
      note: `Tạo công việc: ${data.title}`,
      performed_by: accountId
    });

    // Thông báo cho staff được giao công việc
    if (data.assignee_id) {
      const assigneeAccountId = await getAccountIdByStaffId(data.assignee_id);
      if (assigneeAccountId) {
        notify([assigneeAccountId], {
          type: 'task_assigned',
          title: 'Bạn được giao công việc mới',
          message: `Công việc "${data.title}" trong dự án ${data.project_id}.`,
          related_type: 'task',
          related_id: String(taskId)
        });
      }
    }

    return TaskModel.findById(taskId);
  },

  /**
   * Update task details.
   */
  async updateTask(id, data) {
    const task = await TaskModel.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(data.deadline) < today) {
        const error = new Error('Hạn chót công việc không được trước ngày hiện tại');
        error.statusCode = 400;
        throw error;
      }
    }

    const projectId = data.project_id || task.project_id;
    const { query } = require('../config/database');
    const projectRows = await query(
      "SELECT id FROM projects WHERE id = ?",
      [projectId]
    );
    if (projectRows.length === 0) {
      const error = new Error('Dự án không tồn tại.');
      error.statusCode = 400;
      throw error;
    }

    const allowed = {};
    ['title', 'description', 'assignee_id', 'deadline', 'priority', 'step'].forEach(key => {
      if (data[key] !== undefined) allowed[key] = data[key];
    });

    await TaskModel.update(id, allowed);
    return TaskModel.findById(id);
  },

  /**
   * Delete a task.
   */
  async deleteTask(id) {
    const task = await TaskModel.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    await TaskModel.delete(id);
  }
};

module.exports = TaskService;
