const { query } = require('../config/database');

/**
 * Account Model - Data access layer for the accounts table
 */
const AccountModel = {
  /**
   * Find an account by email address.
   * @param {string} email
   * @returns {Promise<Object|null>} Account row or null
   */
  async findByEmail(email) {
    const rows = await query('SELECT * FROM accounts WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find an account by ID.
   * @param {number} id
   * @returns {Promise<Object|null>} Account row or null
   */
  async findById(id) {
    const rows = await query('SELECT * FROM accounts WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new account.
   * @param {Object} accountData - { email, password_hash, role, status }
   * @returns {Promise<Object>} Created account info with insertId
   */
  async create(accountData) {
    const { email, password_hash, role, status = 'active' } = accountData;
    const result = await query(
      'INSERT INTO accounts (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
      [email, password_hash, role, status]
    );
    return { id: result.insertId, email, role, status };
  },

  /**
   * Update account status.
   * @param {number} id - Account ID
   * @param {string} status - New status ('active', 'inactive', 'locked')
   * @returns {Promise<Object>} Query result
   */
  async updateStatus(id, status) {
    return query('UPDATE accounts SET status = ? WHERE id = ?', [status, id]);
  }
};

module.exports = AccountModel;
