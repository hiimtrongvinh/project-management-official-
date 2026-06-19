const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { checkProjectAccess, checkProjectEstimationAccess } = require('../middleware/accessGuard');

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

// PUT /api/projects/:id/send-quotation - Admin/Staff sends quotation to client
router.put('/:id/send-quotation', authorize('admin', 'staff'), checkProjectAccess, ProjectController.sendQuotation);

// POST /api/projects/:id/contract - Admin/Staff generates contract
router.post('/:id/contract', authorize('admin', 'staff'), checkProjectAccess, ProjectController.createContract);

// POST /api/projects/:id/handover - Admin/Staff generates handover note
router.post('/:id/handover', authorize('admin', 'staff'), checkProjectAccess, ProjectController.createHandoverNote);

// POST /api/projects/:id/acceptance - Admin/Staff generates acceptance note
router.post('/:id/acceptance', authorize('admin', 'staff'), checkProjectAccess, ProjectController.createAcceptanceNote);

// POST /api/projects/:id/payment-request - Admin/Staff generates payment request
router.post('/:id/payment-request', authorize('admin', 'staff'), checkProjectAccess, ProjectController.createPaymentRequest);

module.exports = router;
