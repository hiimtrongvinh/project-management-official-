const NotificationModel = require('../models/notification.model');

/**
 * Notification Service - Business logic for notifications
 */
const NotificationService = {
  /**
   * Get notifications for a user.
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async getNotifications(userId) {
    return NotificationModel.findByUserId(userId);
  },

  /**
   * Create a new notification.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createNotification(data) {
    return NotificationModel.create(data);
  },

  /**
   * Mark notification as read.
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async markAsRead(id, userId) {
    await NotificationModel.markAsRead(id, userId);
  },

  /**
   * Mark all notifications as read.
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async markAllAsRead(userId) {
    await NotificationModel.markAllAsRead(userId);
  },

  async getUnreadCount(userId) {
    return NotificationModel.findUnreadCount(userId);
  },

  async deleteNotification(id, userId) {
    await NotificationModel.delete(id, userId);
  }
};

module.exports = NotificationService;
