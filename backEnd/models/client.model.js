const { query } = require('../config/database');

/**
 * Client Model - Data access layer for the clients table
 */
const ClientModel = {
  /**
   * Find all clients with pagination and optional filters.
   * @param {Object} filters - { type, search }
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Array, total: number, page: number, totalPages: number}>}
   */
  async findAll(filters = {}, page = 1, limit = 20) {
    let countSql = 'SELECT COUNT(*) as total FROM clients c JOIN accounts a ON c.account_id = a.id';
    let dataSql = 'SELECT c.*, a.email, a.status as account_status FROM clients c JOIN accounts a ON c.account_id = a.id';
    const conditions = [];
    const params = [];

    if (filters.type) {
      conditions.push('c.type = ?');
      params.push(filters.type);
    }

    if (filters.search) {
      conditions.push('(c.name LIKE ? OR a.email LIKE ? OR c.phone LIKE ? OR c.id_number LIKE ?)');
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
    dataSql += ' ORDER BY c.id ASC LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    // Debug helper: ensure LIMIT/OFFSET are valid numbers
    console.log('[clients.findAll] pagination', {
      limit,
      offset,
      limitType: typeof limit,
      offsetType: typeof offset,
      limitIsNaN: Number.isNaN(limit),
      offsetIsNaN: Number.isNaN(offset),
      paramsIsArray: Array.isArray(params),
      params
    });

    const data = await query(dataSql, params);
    const totalPages = Math.ceil(total / limit);


    return { data, total, page, totalPages };
  },

  /**
   * Find a client by ID.
   * @param {string} id - Client ID (e.g., KH001)
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const rows = await query(
      'SELECT c.*, a.email, a.status as account_status FROM clients c JOIN accounts a ON c.account_id = a.id WHERE c.id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find a client by account ID.
   * @param {number} accountId
   * @returns {Promise<Object|null>}
   */
  async findByAccountId(accountId) {
    const rows = await query(
      'SELECT c.*, a.email, a.status as account_status FROM clients c JOIN accounts a ON c.account_id = a.id WHERE c.account_id = ?',
      [accountId]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new client record.
   * @param {Object} data - { id, account_id, type, id_number, name, phone, address }
   * @returns {Promise<Object>} Created client record
   */
  async create(data) {
    const { id, account_id, type, id_number, name, phone, address } = data;
    await query(
      'INSERT INTO clients (id, account_id, type, id_number, name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, account_id, type, id_number || null, name, phone || null, address || null]
    );
    return this.findById(id);
  },

  /**
   * Update a client record.
   * @param {string} id - Client ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object|null>} Updated client record
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
      await query('UPDATE accounts a JOIN clients c ON c.account_id = a.id SET a.status = ? WHERE c.id = ?', [dbStatus, id]);
    }

    const allowedFields = ['type', 'id_number', 'name', 'phone', 'address'];
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
    await query(`UPDATE clients SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  /**
   * Delete a client record.
   * @param {string} id - Client ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await query('DELETE FROM clients WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = ClientModel;
