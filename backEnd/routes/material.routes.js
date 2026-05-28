const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/material.controller');
const authenticate = require('../middleware/auth');

const upload = require('../middleware/upload');

// All routes require authentication
router.use(authenticate);

router.get('/', MaterialController.getMaterials);
router.get('/:id', MaterialController.getMaterialById);
router.post('/', upload.single('image'), MaterialController.createMaterial);
router.put('/:id', upload.single('image'), MaterialController.updateMaterial);
router.delete('/:id', MaterialController.deleteMaterial);

module.exports = router;

