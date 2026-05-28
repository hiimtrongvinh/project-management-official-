const NotificationService = require('../services/notification.service');

/**
 * Notification Controller - HTTP request handlers for notifications
 */
const NotificationController = {
  /**
   * GET /api/notifications
   * Get all notifications for the authenticated user.
   */
  async getNotifications(req, res, next) {
    try {
      const notifications = await NotificationService.getNotifications(req.user.id);
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/notifications/:id/read
   * Mark a notification as read.
   */
  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(parseInt(id, 10), req.user.id);
      res.json({
        success: true,
        message: 'Notification marked as read.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/notifications/read-all
   * Mark all notifications as read.
   */
  async markAllAsRead(req, res, next) {
    try {
      await NotificationService.markAllAsRead(req.user.id);
      res.json({
        success: true,
        message: 'All notifications marked as read.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);
      res.json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/notifications/:id
   */
  async deleteNotification(req, res, next) {
    try {
      await NotificationService.deleteNotification(parseInt(req.params.id, 10), req.user.id);
      res.json({ success: true, message: 'Notification deleted.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = NotificationController;
