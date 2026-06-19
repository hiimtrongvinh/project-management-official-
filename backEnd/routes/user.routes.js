const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { checkUserAccess } = require('../middleware/accessGuard');
const UserController = require('../controllers/user.controller');
const upload = require('../middleware/upload');

// All user management routes require authentication
router.use(authenticate);

// List routes - Admin only
router.get('/staff', authorize('admin'), UserController.getStaff);
router.get('/clients', authorize('admin'), UserController.getClients);
router.get('/suppliers', authorize('admin'), UserController.getSuppliers);

// Upload avatar for staff
router.post('/:id/avatar', upload.single('avatar'), checkUserAccess, UserController.uploadAvatar);

// Create user by type - Admin only
router.post('/:type', authorize('admin'), UserController.createUser);

// Update user by ID
router.put('/:id', checkUserAccess, UserController.updateUser);

// Deactivate user (soft delete) by ID - Admin only
router.delete('/:id', authorize('admin'), UserController.deleteUser);

module.exports = router;
