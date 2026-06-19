const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { checkProjectAccess, checkProjectEstimationAccess, checkProjectStepActionAccess } = require('../middleware/accessGuard');

// All routes require authentication
router.use(authenticate);

// GET /api/projects - Admin: all, Staff: assigned, Client: own
router.get('/', ProjectController.getProjects);

// GET /api/projects/:id - with role-based access check
router.get('/:id', checkProjectAccess, ProjectController.getProjectById);

// POST /api/projects/request - Client submits project request
router.post('/request', ProjectController.requestProject);

// POST /api/projects - Admin only
router.post('/', authorize('admin'), ProjectController.createProject);

// PUT /api/projects/:id - Admin/Staff/Client with estimation guard
router.put('/:id', checkProjectEstimationAccess, ProjectController.updateProject);

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

// PUT /api/projects/:id/reject - Admin only
router.put('/:id/reject', authorize('admin'), ProjectController.rejectProject);

// PUT /api/projects/:id/quotation-status - Client can approve/reject
router.put('/:id/quotation-status', checkProjectAccess, ProjectController.updateQuotationStatus);

// PUT /api/projects/:id/send-quotation - Only admin, or staff assigned to step 2 tasks
router.put('/:id/send-quotation', checkProjectStepActionAccess(2), ProjectController.sendQuotation);

// POST /api/projects/:id/contract - Only admin, or staff assigned to step 2 tasks
router.post('/:id/contract', checkProjectStepActionAccess(2), ProjectController.createContract);

// POST /api/projects/:id/handover - Only admin, or staff assigned to step 4 tasks
router.post('/:id/handover', checkProjectStepActionAccess(4), ProjectController.createHandoverNote);

// POST /api/projects/:id/acceptance - Only admin, or staff assigned to step 4 tasks
router.post('/:id/acceptance', checkProjectStepActionAccess(4), ProjectController.createAcceptanceNote);

// POST /api/projects/:id/payment-request - Only admin, or staff assigned to step 5 tasks
router.post('/:id/payment-request', checkProjectStepActionAccess(5), ProjectController.createPaymentRequest);

module.exports = router;
