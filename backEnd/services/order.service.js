const OrderModel = require('../models/order.model');
const { generateOrderId } = require('../utils/helpers');
const { getAccountIdBySupplierId, getAdminAccountIds, notify } = require('../utils/notificationHelpers');

/**
 * Order Service - Business logic for orders and project materials
 */
const OrderService = {
  /**
   * Get orders for a project.
   * @param {string} projectId
   * @returns {Promise<Array>}
   */
  async getOrdersByProject(projectId) {
    const orders = await OrderModel.findByProjectId(projectId);
    
    // Fetch project items that have NO order_id yet
    const { query } = require('../config/database');
    const unorderedItems = await query(
      `SELECT pi.*, m.name as material_name, m.sku as material_sku, m.price as material_price, s.name as supplier_name, s.id as supplier_id
       FROM project_items pi
       LEFT JOIN materials m ON pi.material_id = m.id
       LEFT JOIN suppliers s ON m.supplier_id = s.id
       WHERE pi.project_id = ? AND pi.order_id IS NULL`,
      [projectId]
    );

    if (unorderedItems.length > 0) {
      // Group by supplier
      const groupedBySupplier = unorderedItems.reduce((acc, item) => {
        const supId = item.supplier_id || 'NC_UNKNOWN';
        const supName = item.supplier_name || 'Nhà cung cấp';
        if (!acc[supId]) {
          acc[supId] = {
            id: null,
            project_id: projectId,
            supplier_id: supId,
            supplier_name: supName,
            status: 'Chưa đặt hàng',
            items: []
          };
        }
        acc[supId].items.push(item);
        return acc;
      }, {});

      // Add these virtual orders to the array
      Object.values(groupedBySupplier).forEach(virtualOrder => {
        orders.push(virtualOrder);
      });
    }

    return orders;
  },

  /**
   * Create a new purchase order.
   * @param {Object} data - { project_id, supplier_id, order_date, expected_date, receiver_id, address, status, total_value, note, items }
   * @returns {Promise<Object>}
   */
  async createOrder(data) {
    const orderId = await generateOrderId();
    const result = await OrderModel.create({ ...data, id: orderId });

    // Inform supplier of new order PO
    if (data.supplier_id) {
      const supplierAccountId = await getAccountIdBySupplierId(data.supplier_id);
      if (supplierAccountId) {
        notify([supplierAccountId], {
          type: 'order_received',
          title: 'Bạn nhận được đơn đặt hàng mới',
          message: `e-Teck đã gửi đơn đặt hàng mới #${orderId} cho dự án ${data.project_id}. Tổng giá trị: ${Number(data.total_value || 0).toLocaleString('vi-VN')}đ.`,
          related_type: 'order',
          related_id: orderId
        });
      }
    }

    return result;
  },

  /**
   * Update order status.
   * @param {string} id
   * @param {string} status - 'Mới', 'Đang xử lý', 'Hoàn thành', 'Hủy'
   * @returns {Promise<void>}
   */
  async updateOrderStatus(id, status) {
    const order = await OrderModel.findById(id);
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }
    await OrderModel.updateStatus(id, status);

    // Inform admins when order status is updated by supplier or staff
    const adminIds = await getAdminAccountIds();
    notify(adminIds, {
      type: 'order_status_updated',
      title: 'Đơn hàng được cập nhật',
      message: `Đơn hàng #${id} đã chuyển sang trạng thái: ${status}.`,
      related_type: 'order',
      related_id: id
    });
  },

  /**
   * Get orders for currently logged in user.
   * @param {number} accountId
   * @param {string} role
   * @returns {Promise<Array>}
   */
  async getMyOrders(accountId, role) {
    return OrderModel.findByAccountId(accountId, role);
  },

  /**
   * Update quantity and markup of a project item.
   * @param {number} id
   * @param {Object} data - { quantity, markup }
   * @returns {Promise<void>}
   */
  async updateProjectItem(id, data) {
    await OrderModel.updateProjectItem(id, data);
  },

  /**
   * Add a project item.
   */
  async addProjectItem(data) {
    const { project_id, material_id, quantity = 1, markup = 10 } = data;
    if (!project_id || !material_id) {
      const error = new Error('project_id and material_id are required');
      error.statusCode = 400;
      throw error;
    }
    const { query } = require('../config/database');
    // Check if it already exists as unordered
    const existing = await query(
      'SELECT id, quantity FROM project_items WHERE project_id = ? AND material_id = ? AND order_id IS NULL',
      [project_id, material_id]
    );
    if (existing.length > 0) {
      await query(
        'UPDATE project_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
      return { id: existing[0].id, quantity: existing[0].quantity + quantity };
    } else {
      const result = await query(
        'INSERT INTO project_items (project_id, order_id, material_id, quantity, markup) VALUES (?, NULL, ?, ?, ?)',
        [project_id, material_id, quantity, markup]
      );
      return { id: result.insertId, project_id, material_id, quantity, markup };
    }
  },

  /**
   * Delete a project item.
   */
  async deleteProjectItem(id) {
    const { query } = require('../config/database');
    const existing = await query('SELECT id FROM project_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      const error = new Error('Project item not found');
      error.statusCode = 404;
      throw error;
    }
    await query('DELETE FROM project_items WHERE id = ?', [id]);
  }
};

module.exports = OrderService;
