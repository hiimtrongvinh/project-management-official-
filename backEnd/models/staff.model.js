const { query } = require('../config/database');

/**
 * Staff Model - Data access layer for the staffs table
 */
const StaffModel = {
  /**
   * Find all staff with pagination and optional filters.
   * @param {Object} filters - { status, department, search }
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Array, total: number, page: number, totalPages: number}>}
   */
  async findAll(filters = {}, page = 1, limit = 20) {
    let countSql = 'SELECT COUNT(*) as total FROM staffs s JOIN accounts a ON s.account_id = a.id';
    let dataSql = 'SELECT s.*, a.email, a.status as account_status FROM staffs s JOIN accounts a ON s.account_id = a.id';
    const conditions = [];
    const params = [];

    if (filters.status) {
      const statusMap = {
        'Hoạt động': 'active',
        'Nghỉ việc': 'inactive',
        'Tạm nghỉ': 'locked',
        'active': 'active',
        'inactive': 'inactive',
        'locked': 'locked'
      };
      conditions.push('a.status = ?');
      params.push(statusMap[filters.status] || filters.status);
    }

    if (filters.department) {
      conditions.push('s.department = ?');
      params.push(filters.department);
    }

    if (filters.search) {
      conditions.push('(s.name LIKE ? OR a.email LIKE ? OR s.phone LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
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
   * Find a staff member by ID.
   * @param {string} id - Staff ID (e.g., NV001)
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const rows = await query(
      'SELECT s.*, a.email, a.status as account_status FROM staffs s JOIN accounts a ON s.account_id = a.id WHERE s.id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find a staff member by account ID.
   * @param {number} accountId
   * @returns {Promise<Object|null>}
   */
  async findByAccountId(accountId) {
    const rows = await query(
      'SELECT s.*, a.email, a.status as account_status FROM staffs s JOIN accounts a ON s.account_id = a.id WHERE s.account_id = ?',
      [accountId]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new staff record.
   * @param {Object} data - { id, account_id, name, department, position, phone, status }
   * @returns {Promise<Object>} Created staff record
   */
  async create(data) {
    const { id, account_id, name, department, position, phone, avatar = null } = data;
    await query(
      'INSERT INTO staffs (id, account_id, name, department, position, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, account_id, name, department, position || null, phone, avatar]
    );
    return this.findById(id);
  },

  /**
   * Update a staff record.
   * @param {string} id - Staff ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object|null>} Updated staff record
   */
  async update(id, data) {
    const allowedFields = ['name', 'department', 'position', 'phone', 'avatar'];
    const updates = [];
    const params = [];

    if (data.status !== undefined) {
      const statusMap = {
        'Hoạt động': 'active',
        'Nghỉ việc': 'inactive',
        'Tạm nghỉ': 'locked',
        'active': 'active',
        'inactive': 'inactive',
        'locked': 'locked'
      };
      const dbStatus = statusMap[data.status] || data.status;
      await query('UPDATE accounts a JOIN staffs s ON s.account_id = a.id SET a.status = ? WHERE s.id = ?', [dbStatus, id]);
    }

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(data[field]);
      }
    }

    if (updates.length === 0) return this.findById(id);

    params.push(id);
    await query(`UPDATE staffs SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  /**
   * Delete a staff record (hard delete - use deactivate instead for soft delete).
   * @param {string} id - Staff ID
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await query('DELETE FROM staffs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = StaffModel;
