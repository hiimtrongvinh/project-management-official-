const { query } = require('../config/database');

/**
 * Supplier Model - Data access layer for the suppliers table
 */
const SupplierModel = {
  /**
   * Find all suppliers with pagination and optional filters.
   * @param {Object} filters - { search }
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Array, total: number, page: number, totalPages: number}>}
   */
  async findAll(filters = {}, page = 1, limit = 20) {
    let countSql = 'SELECT COUNT(*) as total FROM suppliers s JOIN accounts a ON s.account_id = a.id';
    let dataSql = 'SELECT s.*, a.email, a.status as account_status FROM suppliers s JOIN accounts a ON s.account_id = a.id';
    const conditions = [];
    const params = [];

    if (filters.search) {
      conditions.push('(s.name LIKE ? OR a.email LIKE ? OR s.phone LIKE ? OR s.id_number LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      countSql += whereClause;
      dataSql += whereClause;
    }

    // Get total count
    const countParams = [...params];
    const countResult = await query(countSql, countParams);
    const total = countResult[0].total;

    // Add pagination
    const offset = (page - 1) * limit;
    dataSql += ' ORDER BY s.id ASC LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    const data = await query(dataSql, params);
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, totalPages };
  },

  /**
   * Find a supplier by ID.
   * @param {string} id - Supplier ID (e.g., NC001)
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const rows = await query(
      'SELECT s.*, a.email, a.status as account_status FROM suppliers s JOIN accounts a ON s.account_id = a.id WHERE s.id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find a supplier by account ID.
   * @param {number} accountId
   * @returns {Promise<Object|null>}
   */
  async findByAccountId(accountId) {
    const rows = await query(
      'SELECT s.*, a.email, a.status as account_status FROM suppliers s JOIN accounts a ON s.account_id = a.id WHERE s.account_id = ?',
      [accountId]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new supplier record.
   * @param {Object} data - { id, account_id, id_number, name, phone, address }
   * @returns {Promise<Object>} Created supplier record
   */
  async create(data) {
    const { id, account_id, id_number, name, phone, address } = data;
    await query(
      'INSERT INTO suppliers (id, account_id, id_number, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [id, account_id, id_number || null, name, phone || null, address || null]
    );
    return this.findById(id);
  },

  /**
   * Update a supplier record.
   * @param {string} id - Supplier ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object|null>} Updated supplier record
   */
  async update(id, data) {
    if (data.status !== undefined) {
      const statusMap = {
        'Hoạt động': 'active',
        'Bị khóa': 'locked',
        'active': 'active',
        'locked': 'locked',
        'inactive': 'locked'
      };
      const dbStatus = statusMap[data.status] || data.status;
      await query('UPDATE accounts a JOIN suppliers s ON s.account_id = a.id SET a.status = ? WHERE s.id = ?', [dbStatus, id]);
    }

    const allowedFields = ['id_number', 'name', 'phone', 'address'];
    const updates = [];
    const params = [];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    }

    if (updates.length === 0) return this.findById(id);

    params.push(id);
    await query(`UPDATE suppliers SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  /**
   * Delete a supplier record.
   * @param {string} id - Supplier ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await query('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = SupplierModel;
