const { query } = require('../config/database');
const NotificationService = require('../services/notification.service');

/**
 * Notification Helpers - Lấy account_id theo role và gửi thông báo
 */

async function getAccountIdByStaffId(staffId) {
  const rows = await query('SELECT account_id FROM staffs WHERE id = ?', [staffId]);
  return rows.length > 0 ? rows[0].account_id : null;
}

async function getAccountIdByClientId(clientId) {
  const rows = await query('SELECT account_id FROM clients WHERE id = ?', [clientId]);
  return rows.length > 0 ? rows[0].account_id : null;
}

async function getAccountIdBySupplierId(supplierId) {
  const rows = await query('SELECT account_id FROM suppliers WHERE id = ?', [supplierId]);
  return rows.length > 0 ? rows[0].account_id : null;
}

async function getAdminAccountIds() {
  const rows = await query("SELECT id FROM accounts WHERE role = 'admin' AND status = 'active'");
  return rows.map(r => r.id);
}

async function getProjectMemberAccountIds(projectId) {
  const rows = await query(
    `SELECT s.account_id FROM project_members pm 
     JOIN staffs s ON pm.staff_id = s.id 
     WHERE pm.project_id = ?`,
    [projectId]
  );
  return rows.map(r => r.account_id);
}

async function getProjectClientAccountId(projectId) {
  const rows = await query(
    `SELECT c.account_id FROM projects p 
     JOIN clients c ON p.client_id = c.id 
     WHERE p.id = ?`,
    [projectId]
  );
  return rows.length > 0 ? rows[0].account_id : null;
}

/**
 * Gửi thông báo cho nhiều user cùng lúc (bỏ qua lỗi, không block luồng chính)
 */
async function notify(userIds, { type, title, message, related_type, related_id }) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  for (const user_id of uniqueIds) {
    try {
      await NotificationService.createNotification({
        user_id, type, title, message, related_type, related_id
      });
    } catch (err) {
      console.error(`[Notification] Failed to notify user ${user_id}:`, err.message);
    }
  }
}

module.exports = {
  getAccountIdByStaffId,
  getAccountIdByClientId,
  getAccountIdBySupplierId,
  getAdminAccountIds,
  getProjectMemberAccountIds,
  getProjectClientAccountId,
  notify
};
