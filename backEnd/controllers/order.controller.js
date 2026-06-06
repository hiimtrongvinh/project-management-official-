const OrderService = require('../services/order.service');

/**
 * Order Controller - HTTP request handlers for order management
 */
const OrderController = {
  /**
   * GET /api/orders/project/:projectId
   * Get all orders for a project.
   */
  async getOrdersByProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const orders = await OrderService.getOrdersByProject(projectId);
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/orders/my-orders
   * Get orders associated with the logged-in user.
   */
  async getMyOrders(req, res, next) {
    try {
      const orders = await OrderService.getMyOrders(req.user.id, req.user.role);
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * GET /api/orders/:id
   * Get a single order by ID.
   */
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: { message: 'Order not found' }
        });
      }
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/orders
   * Create a new purchase order.
   */
  async createOrder(req, res, next) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/orders/:id/status
   * Update order status.
   */
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Mới', 'Đang xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Hủy'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid status. Must be "Mới", "Đang xử lý", "Đã xác nhận", "Đang giao", "Hoàn thành", or "Hủy".' }
        });
      }

      await OrderService.updateOrderStatus(id, status);
      res.json({
        success: true,
        message: 'Order status updated successfully.'
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/orders/project-item/:id
   * Update quantity and markup of a project item.
   */
  async updateProjectItem(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity, markup } = req.body;

      await OrderService.updateProjectItem(id, { quantity, markup });
      res.json({
        success: true,
        message: 'Project item updated successfully.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/orders/project-item
   * Add a new project item estimation.
   */
  async addProjectItem(req, res, next) {
    try {
      const item = await OrderService.addProjectItem(req.body);
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/orders/project-item/:id
   * Delete a project item estimation.
   */
  async deleteProjectItem(req, res, next) {
    try {
      const { id } = req.params;
      await OrderService.deleteProjectItem(parseInt(id, 10));
      res.json({
        success: true,
        message: 'Project item deleted successfully.'
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * GET /api/orders/:id/export-docx
   * Export purchase order to .docx format.
   */
  async exportOrderDocx(req, res, next) {
    try {
      const { id } = req.params;
      const buffer = await OrderService.exportOrderDocx(id);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=Don_dat_hang_${id}.docx`);
      res.send(buffer);
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  }
};

module.exports = OrderController;
