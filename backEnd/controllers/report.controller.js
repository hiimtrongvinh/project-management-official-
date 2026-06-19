const ReportService = require('../services/report.service');

/**
 * Report Controller - HTTP request handlers for reports and dashboard analytics
 */
const ReportController = {
  /**
   * GET /api/reports/dashboard
   * Fetch statistical analysis for system dashboard.
   * Data is filtered based on user role.
   */
  async getDashboardReport(req, res, next) {
    try {
      const { id, role } = req.user;
      const stats = await ReportService.getDashboardStats(id, role);
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/reports/export-progress
   * Export all projects and tasks progress to Excel.
   */
  async exportProgressReport(req, res, next) {
    try {
      await ReportService.exportProgressExcel(res);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ReportController;


