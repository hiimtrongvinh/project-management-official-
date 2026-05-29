const { query } = require('../config/database');

/**
 * Order Model - Data access layer for orders and project_items tables
 */
const OrderModel = {
  /**
   * Find an order by ID.
   * @param {string} id - PO ID (e.g. PO001)
   * @returns {Promise<Object|null>} Order with items or null
   */
  async findById(id) {
    const rows = await query(
      `SELECT o.*, s.name as supplier_name, st.name as receiver_name
       FROM orders o
       LEFT JOIN suppliers s ON o.supplier_id = s.id
       LEFT JOIN staffs st ON o.receiver_id = st.id
       WHERE o.id = ?`,
      [id]
    );
    if (rows.length === 0) return null;
    
    const items = await query(
      `SELECT pi.*, m.name as material_name, m.sku as material_sku, m.unit as material_unit, m.price as material_price
       FROM project_items pi
       LEFT JOIN materials m ON pi.material_id = m.id
       WHERE pi.order_id = ?`,
      [id]
    );
    return { ...rows[0], items };
  },

  /**
   * Find orders by project ID.
   * @param {string} projectId
   * @returns {Promise<Array>}
   */
  async findByProjectId(projectId) {
    const orders = await query(
      `SELECT o.*, s.name as supplier_name, st.name as receiver_name
       FROM orders o
       LEFT JOIN suppliers s ON o.supplier_id = s.id
       LEFT JOIN staffs st ON o.receiver_id = st.id
       WHERE o.project_id = ?
       ORDER BY o.created_at DESC`,
      [projectId]
    );

    for (let o of orders) {
      o.items = await query(
        `SELECT pi.*, m.name as material_name, m.sku as material_sku, m.price as material_price
         FROM project_items pi
         LEFT JOIN materials m ON pi.material_id = m.id
         WHERE pi.order_id = ?`,
        [o.id]
      );
    }

    return orders;
  },

  /**
   * Find orders by account ID and role.
   * @param {number} accountId
   * @param {string} role
   * @returns {Promise<Array>}
   */
  async findByAccountId(accountId, role) {
    let sql = `
      SELECT o.*, p.title as project_title, s.name as supplier_name, st.name as receiver_name
      FROM orders o
      LEFT JOIN projects p ON o.project_id = p.id
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN staffs st ON o.receiver_id = st.id
    `;
    const params = [];

    if (role === 'supplier') {
      sql += `
        INNER JOIN suppliers s2 ON o.supplier_id = s2.id 
        WHERE s2.account_id = ?
      `;
      params.push(accountId);
    } else if (role === 'staff') {
      sql += `
        INNER JOIN staffs st ON o.receiver_id = st.id 
        WHERE st.account_id = ?
      `;
      params.push(accountId);
    }

    sql += ' ORDER BY o.created_at DESC';

    const orders = await query(sql, params);

    for (let o of orders) {
      o.items = await query(
        `SELECT pi.*, m.name as material_name, m.sku as material_sku, m.price as material_price
         FROM project_items pi
         LEFT JOIN materials m ON pi.material_id = m.id
         WHERE pi.order_id = ?`,
        [o.id]
      );
    }

    return orders;
  },

  /**
   * Create a new order with items.
   * @param {Object} data - { id, project_id, supplier_id, order_date, expected_date, receiver_id, address, status, total_value, note, items: [{ material_id, quantity, markup }] }
   * @returns {Promise<Object>} Created order info
   */
  async create(data) {
    const { id, project_id, supplier_id, order_date, expected_date, receiver_id, address, status = 'Mới', total_value, note, items = [] } = data;
    
    // Calculate total value based on actual material prices in database
    let calculatedTotalValue = 0;
    for (let item of items) {
      const materialRows = await query('SELECT price FROM materials WHERE id = ?', [item.material_id]);
      if (materialRows.length > 0) {
        calculatedTotalValue += parseFloat(materialRows[0].price || 0) * parseInt(item.quantity || 1);
      }
    }
    const finalTotalValue = calculatedTotalValue > 0 ? calculatedTotalValue : (total_value || 0);

    // Insert order
    await query(
      `INSERT INTO orders (id, project_id, supplier_id, order_date, expected_date, receiver_id, address, status, total_value, note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, project_id, supplier_id, order_date || null, expected_date || null, receiver_id || null, address, status, finalTotalValue, note || null]
    );

    // Insert or update project items
    for (let item of items) {
      const { material_id, quantity, markup = 10 } = item;
      
      // Check if project item already exists (and just update its order_id)
      const existing = await query(
        'SELECT id FROM project_items WHERE project_id = ? AND material_id = ? AND order_id IS NULL',
        [project_id, material_id]
      );

      if (existing.length > 0) {
        await query(
          'UPDATE project_items SET order_id = ?, quantity = ?, markup = ? WHERE id = ?',
          [id, quantity, markup, existing[0].id]
        );
      } else {
        await query(
          'INSERT INTO project_items (project_id, order_id, material_id, quantity, markup) VALUES (?, ?, ?, ?, ?)',
          [project_id, id, material_id, quantity, markup]
        );
      }
    }

    return this.findById(id);
  },

  /**
   * Update order status.
   * @param {string} id
   * @param {string} status - 'Mới', 'Đang xử lý', 'Hoàn thành', 'Hủy'
   * @returns {Promise<void>}
   */
  async updateStatus(id, status) {
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  /**
   * Update quantity and markup of a project item.
   * @param {number} id - project_items.id
   * @param {Object} data - { quantity, markup }
   * @returns {Promise<Object>} Query result
   */
  async updateProjectItem(id, data) {
    const fields = [];
    const params = [];
    if (data.quantity !== undefined) {
      fields.push('quantity = ?');
      params.push(data.quantity);
    }
    if (data.markup !== undefined) {
      fields.push('markup = ?');
      params.push(data.markup);
    }
    if (fields.length === 0) return null;
    params.push(id);
    return query(`UPDATE project_items SET ${fields.join(', ')} WHERE id = ?`, params);
  }
};

module.exports = OrderModel;
