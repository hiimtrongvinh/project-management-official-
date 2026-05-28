const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// All routes require authentication
router.use(authenticate);

// GET /api/projects - Admin: all, Staff: assigned, Client: own
router.get('/', ProjectController.getProjects);

// GET /api/projects/:id - with role-based access check
router.get('/:id', ProjectController.getProjectById);

// POST /api/projects/request - Client submits project request
router.post('/request', ProjectController.requestProject);

// POST /api/projects - Admin only
router.post('/', authorize('admin'), ProjectController.createProject);

// PUT /api/projects/:id - Admin only
router.put('/:id', authorize('admin'), ProjectController.updateProject);

// DELETE /api/projects/:id - Admin only
router.delete('/:id', authorize('admin'), ProjectController.deleteProject);

// POST /api/projects/:id/members - Admin only
router.post('/:id/members', authorize('admin'), ProjectController.addMember);

// DELETE /api/projects/:id/members/:staffId - Admin only
router.delete('/:id/members/:staffId', authorize('admin'), ProjectController.removeMember);

// PUT /api/projects/:id/status - Admin only
router.put('/:id/status', authorize('admin'), ProjectController.updateStatus);

// PUT /api/projects/:id/close - Admin only
router.put('/:id/close', authorize('admin'), ProjectController.closeProject);

// PUT /api/projects/:id/quotation-status - Client can approve/reject
router.put('/:id/quotation-status', ProjectController.updateQuotationStatus);

module.exports = router;
