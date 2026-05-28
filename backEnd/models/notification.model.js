const { query } = require('../config/database');

/**
 * Notification Model - Data access layer for the notifications table
 */
const NotificationModel = {
  /**
   * Find notifications for a specific user.
   * @param {number} userId
   * @returns {Promise<Array>} Notification rows
   */
  async findByUserId(userId) {
    return query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  },

  /**
   * Create a new notification.
   * @param {Object} data - { user_id, type, title, message, related_type, related_id }
   * @returns {Promise<Object>} Created notification info
   */
  async create(data) {
    const { user_id, type, title, message, related_id = null } = data;
    const result = await query(
      `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, type, title, message, related_id]
    );
    return { id: result.insertId, ...data, is_read: false };
  },

  /**
   * Mark a notification as read.
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async markAsRead(id, userId) {
    await query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  },

  /**
   * Mark all notifications of a user as read.
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async markAllAsRead(userId) {
    await query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [userId]
    );
  },

  async findUnreadCount(userId) {
    const rows = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );
    return rows[0].count;
  },

  async delete(id, userId) {
    await query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  }
};

module.exports = NotificationModel;
