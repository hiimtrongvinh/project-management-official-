const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', ReportController.getDashboardReport);
router.get('/export-progress', authorize('admin'), ReportController.exportProgressReport);

module.exports = router;


