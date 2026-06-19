const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/material.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { checkMaterialAccess } = require('../middleware/accessGuard');

const upload = require('../middleware/upload');

// All routes require authentication
router.use(authenticate);

router.get('/', MaterialController.getMaterials);
router.get('/:id', MaterialController.getMaterialById);
router.post('/', authorize('admin', 'supplier'), upload.single('image'), MaterialController.createMaterial);
router.put('/:id', authorize('admin', 'supplier'), checkMaterialAccess, upload.single('image'), MaterialController.updateMaterial);
router.delete('/:id', authorize('admin', 'supplier'), checkMaterialAccess, MaterialController.deleteMaterial);

module.exports = router;

