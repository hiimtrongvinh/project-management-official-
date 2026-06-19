const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { checkOrderAccess, checkProjectAccess } = require('../middleware/accessGuard');

// All routes require authentication
router.use(authenticate);

router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id/export-docx', checkOrderAccess, OrderController.exportOrderDocx);
router.get('/project/:projectId', checkProjectAccess, OrderController.getOrdersByProject);
router.get('/:id', checkOrderAccess, OrderController.getOrderById);
router.post('/', authorize('admin', 'staff'), checkProjectAccess, OrderController.createOrder);
router.put('/:id/status', checkOrderAccess, OrderController.updateOrderStatus);
router.put('/project-item/:id', authorize('admin', 'staff'), OrderController.updateProjectItem);
router.post('/project-item', authorize('admin', 'staff'), checkProjectAccess, OrderController.addProjectItem);
router.delete('/project-item/:id', authorize('admin', 'staff'), OrderController.deleteProjectItem);

module.exports = router;
