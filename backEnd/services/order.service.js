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

  async getOrderById(id) {
    return OrderModel.findById(id);
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
  },

  /**
   * Export purchase order as docx buffer.
   * @param {string} id - PO ID
   * @returns {Promise<Buffer>} Docx file buffer
   */
  async exportOrderDocx(id) {
    const docx = require('docx');
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType } = docx;
    const { convertVNDToWords } = require('../utils/numberToWords');

    const order = await OrderModel.findById(id);
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    const tableRows = [];

    // Header Row
    tableRows.push(new TableRow({
      children: [
        new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "STT", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Mã vật tư", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 36, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: "Tên vật tư", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Đơn vị tính", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Số lượng", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Đơn giá", bold: true, size: 20, font: "Times New Roman" })] })] }),
        new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Thành tiền", bold: true, size: 20, font: "Times New Roman" })] })] })
      ]
    }));

    let calculatedTotal = 0;
    (order.items || []).forEach((item, index) => {
      const price = parseFloat(item.material_price || 0);
      const qty = parseInt(item.quantity || 0);
      const subtotal = price * qty;
      calculatedTotal += subtotal;

      tableRows.push(new TableRow({
        children: [
          new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.material_sku || 'SKU-NONE', size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 36, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: item.material_name || 'Vật tư', size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.material_unit || 'Cái', size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(qty), size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: price.toLocaleString('vi-VN'), size: 20, font: "Times New Roman" })] })] }),
          new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: subtotal.toLocaleString('vi-VN'), size: 20, font: "Times New Roman" })] })] })
        ]
      }));
    });

    const totalWords = convertVNDToWords(calculatedTotal);

    tableRows.push(new TableRow({
      children: [
        new TableCell({
          columnSpan: 7,
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Tổng cộng: ", bold: true, size: 20, font: "Times New Roman" }),
                new TextRun({ text: `${calculatedTotal.toLocaleString('vi-VN')} VNĐ`, bold: true, size: 20, font: "Times New Roman" }),
                new TextRun({ text: ` (${totalWords})`, italic: true, size: 20, font: "Times New Roman" })
              ]
            })
          ]
        })
      ]
    }));

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 360 },
              children: [
                new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 480 },
              children: [
                new TextRun({ text: "ĐƠN ĐẶT HÀNG", bold: true, size: 28, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              spacing: { after: 240 },
              children: [
                new TextRun({ text: "Kính gửi: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: order.supplier_name || 'Quý công ty', size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              spacing: { after: 240 },
              children: [
                new TextRun({
                  text: "Công ty TNHH Đào tạo và Tích hợp Công nghệ e-Teck đề nghị Quý công ty cung cấp vật tư, thiết bị phục vụ dự án ",
                  size: 24,
                  font: "Times New Roman"
                }),
                new TextRun({
                  text: order.project_title || order.project_id || 'Dự án',
                  bold: true,
                  size: 24,
                  font: "Times New Roman"
                }),
                new TextRun({
                  text: " với các nội dung chi tiết sau:",
                  size: 24,
                  font: "Times New Roman"
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 240, after: 120 },
              children: [
                new TextRun({ text: "I. Danh mục vật tư, thiết bị đặt hàng", bold: true, size: 24, font: "Times New Roman" })
              ]
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRows
            }),
            new Paragraph({
              spacing: { before: 240, after: 120 },
              children: [
                new TextRun({ text: "II. Điều khoản giao nhận và thanh toán", bold: true, size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "Địa điểm giao hàng: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: order.address || '', size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "Thời gian giao hàng: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: order.expected_date ? new Date(order.expected_date).toLocaleDateString('vi-VN') : '---', size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "Phương thức thanh toán: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: "thanh toán qua chuyển khoản khi nhận hàng hoặc chậm nhất sau ... ngày kể từ ngày giao hàng", size: 24, font: "Times New Roman" })
              ]
            }),
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "Ghi chú: ", bold: true, size: 24, font: "Times New Roman" }),
                new TextRun({ text: order.note || 'Không có', size: 24, font: "Times New Roman" })
              ]
            })
          ]
        }
      ]
    });

    return Packer.toBuffer(doc);
  }
};

module.exports = OrderService;
