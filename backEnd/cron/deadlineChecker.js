const { query } = require('../config/database');
const NotificationService = require('../services/notification.service');

/**
 * Deadline Checker - Quét tasks và projects sắp hết hạn / quá hạn
 * Chạy định kỳ mỗi giờ
 */
async function checkDeadlines() {
  console.log('[Cron] Đang quét deadline...');

  try {
    // 1. Công việc sắp đến hạn (≤ 48h), chưa hoàn thành
    const upcomingTasks = await query(
      `SELECT t.id, t.title, t.assignee_id, t.project_id, t.deadline,
              s.account_id AS assignee_account_id
       FROM tasks t
       LEFT JOIN staffs s ON t.assignee_id = s.id
       WHERE t.deadline IS NOT NULL
         AND t.status != 'Đã duyệt'
         AND t.deadline > NOW()
         AND t.deadline <= DATE_ADD(NOW(), INTERVAL 48 HOUR)
         AND t.assignee_id IS NOT NULL`
    );

    for (const task of upcomingTasks) {
      if (!task.assignee_account_id) continue;
      // Chống trùng: kiểm tra đã gửi notification cùng type + related_id trong 24h chưa
      const existing = await query(
        `SELECT id FROM notifications 
         WHERE user_id = ? AND type = 'task_deadline_warning' AND related_id = ?`,
        [task.assignee_account_id, task.id]
      );
      if (existing.length > 0) continue;

      const deadlineStr = new Date(task.deadline).toLocaleDateString('vi-VN');
      await NotificationService.createNotification({
        user_id: task.assignee_account_id,
        type: 'task_deadline_warning',
        title: 'Công việc sắp đến hạn',
        message: `Công việc "${task.title}" sẽ hết hạn vào ${deadlineStr}.`,
        related_type: 'task',
        related_id: task.id
      });
    }

    // 2. Công việc đã quá hạn, chưa hoàn thành
    const overdueTasks = await query(
      `SELECT t.id, t.title, t.assignee_id, t.project_id, t.deadline,
              s.account_id AS assignee_account_id
       FROM tasks t
       LEFT JOIN staffs s ON t.assignee_id = s.id
       WHERE t.deadline IS NOT NULL
         AND t.status != 'Đã duyệt'
         AND t.deadline < NOW()
         AND t.assignee_id IS NOT NULL`
    );

    // Lấy danh sách admin
    const adminRows = await query("SELECT id FROM accounts WHERE role = 'admin' AND status = 'active'");
    const adminIds = adminRows.map(r => r.id);

    for (const task of overdueTasks) {
      const deadlineStr = new Date(task.deadline).toLocaleDateString('vi-VN');

      // Gửi cho staff được giao
      if (task.assignee_account_id) {
        const existStaff = await query(
          `SELECT id FROM notifications 
           WHERE user_id = ? AND type = 'task_overdue' AND related_id = ?`,
          [task.assignee_account_id, task.id]
        );
        if (existStaff.length === 0) {
          await NotificationService.createNotification({
            user_id: task.assignee_account_id,
            type: 'task_overdue',
            title: 'Công việc đã quá hạn!',
            message: `Công việc "${task.title}" đã quá hạn từ ${deadlineStr}.`,
            related_type: 'task',
            related_id: task.id
          });
        }
      }

      // Gửi cho admin
      for (const adminId of adminIds) {
        const existAdmin = await query(
          `SELECT id FROM notifications 
           WHERE user_id = ? AND type = 'task_overdue' AND related_id = ?`,
          [adminId, task.id]
        );
        if (existAdmin.length === 0) {
          await NotificationService.createNotification({
            user_id: adminId,
            type: 'task_overdue',
            title: 'Công việc đã quá hạn!',
            message: `Công việc "${task.title}" (dự án ${task.project_id}) đã quá hạn từ ${deadlineStr}.`,
            related_type: 'task',
            related_id: task.id
          });
        }
      }
    }

    // 3. Dự án sắp đến hạn (≤ 48h), chưa hoàn thành
    const upcomingProjects = await query(
      `SELECT id, title, deadline AS end_date FROM projects
       WHERE deadline IS NOT NULL
         AND current_step != 6
         AND deadline > NOW()
         AND deadline <= DATE_ADD(NOW(), INTERVAL 48 HOUR)`
    );

    for (const proj of upcomingProjects) {
      const endStr = new Date(proj.end_date).toLocaleDateString('vi-VN');

      // Gửi cho admin
      for (const adminId of adminIds) {
        const exist = await query(
          `SELECT id FROM notifications 
           WHERE user_id = ? AND type = 'project_deadline_warning' AND related_id = ?`,
          [adminId, proj.id]
        );
        if (exist.length === 0) {
          await NotificationService.createNotification({
            user_id: adminId,
            type: 'project_deadline_warning',
            title: 'Dự án sắp đến hạn',
            message: `Dự án "${proj.title}" sẽ hết hạn vào ${endStr}.`,
            related_type: 'project',
            related_id: proj.id
          });
        }
      }

      // Gửi cho staff thành viên
      const memberRows = await query(
        `SELECT s.account_id FROM project_members pm 
         JOIN staffs s ON pm.staff_id = s.id 
         WHERE pm.project_id = ?`,
        [proj.id]
      );
      for (const member of memberRows) {
        const exist = await query(
          `SELECT id FROM notifications 
           WHERE user_id = ? AND type = 'project_deadline_warning' AND related_id = ?`,
          [member.account_id, proj.id]
        );
        if (exist.length === 0) {
          await NotificationService.createNotification({
            user_id: member.account_id,
            type: 'project_deadline_warning',
            title: 'Dự án sắp đến hạn',
            message: `Dự án "${proj.title}" sẽ hết hạn vào ${endStr}.`,
            related_type: 'project',
            related_id: proj.id
          });
        }
      }
    }

    console.log(`[Cron] Quét xong: ${upcomingTasks.length} task sắp hạn, ${overdueTasks.length} task quá hạn, ${upcomingProjects.length} dự án sắp hạn.`);
  } catch (err) {
    console.error('[Cron] Lỗi quét deadline:', err.message);
  }
}

module.exports = { checkDeadlines };
