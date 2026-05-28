const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// All routes require authentication
router.use(authenticate);

router.get('/', CategoryController.getCategories);
router.post('/', authorize('admin'), CategoryController.createCategory);
router.put('/:id', authorize('admin'), CategoryController.updateCategory);
router.delete('/:id', authorize('admin'), CategoryController.deleteCategory);

module.exports = router;
