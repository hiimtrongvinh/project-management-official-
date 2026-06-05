const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authenticate = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id/export-docx', OrderController.exportOrderDocx);
router.get('/project/:projectId', OrderController.getOrdersByProject);
router.post('/', OrderController.createOrder);
router.put('/:id/status', OrderController.updateOrderStatus);
router.put('/project-item/:id', OrderController.updateProjectItem);
router.post('/project-item', OrderController.addProjectItem);
router.delete('/project-item/:id', OrderController.deleteProjectItem);

module.exports = router;
