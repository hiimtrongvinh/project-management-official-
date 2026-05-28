const AccountModel = require('../models/account.model');
const { comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { query } = require('../config/database');

/**
 * Auth Service - Business logic for authentication
 */
const AuthService = {
  /**
   * Authenticate a user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token: string, user: Object}>}
   * @throws {Error} With statusCode 401 for invalid credentials or inactive account
   */
  async authenticate(email, password) {
    // Find account by email
    const account = await AccountModel.findByEmail(email);
    if (!account) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check account status
    if (account.status !== 'active') {
      const error = new Error('Account is disabled or locked');
      error.statusCode = 401;
      throw error;
    }



    // Compare password
    const isValid = await comparePassword(password, account.password_hash);
    if (!isValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateToken({
      id: account.id,
      email: account.email,
      role: account.role
    });

    return {
      token,
      user: {
        id: account.id,
        email: account.email,
        role: account.role
      }
    };
  },

  /**
   * Get user profile based on role.
   * Joins with staffs/clients/suppliers table depending on role.
   * Never exposes password_hash.
   * @param {number} userId
   * @param {string} role
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId, role) {
    const account = await AccountModel.findById(userId);
    if (!account) {
      const error = new Error('Account not found');
      error.statusCode = 404;
      throw error;
    }

    // Base profile without password_hash
    const profile = {
      id: account.id,
      email: account.email,
      role: account.role,
      status: account.status,
      created_at: account.created_at
    };

    // Join with role-specific table
    if (['admin', 'staff'].includes(role)) {
      const staffRows = await query(
        'SELECT id as staff_id, name, department, position, phone, avatar FROM staffs WHERE account_id = ?',
        [userId]
      );
      if (staffRows.length > 0) {
        Object.assign(profile, staffRows[0], { staff_status: account.status });
      }
    } else if (role === 'client') {
      const clientRows = await query(
        'SELECT id as client_id, type, id_number, name, phone, address FROM clients WHERE account_id = ?',
        [userId]
      );
      if (clientRows.length > 0) {
        Object.assign(profile, clientRows[0]);
      }
    } else if (role === 'supplier') {
      const supplierRows = await query(
        'SELECT id as supplier_id, id_number, name, phone, address FROM suppliers WHERE account_id = ?',
        [userId]
      );
      if (supplierRows.length > 0) {
        Object.assign(profile, supplierRows[0]);
      }
    }

    return profile;
  },

  /**
   * Update user profile (non-sensitive fields only).
   * Cannot change role or status.
   * @param {number} userId
   * @param {string} role
   * @param {Object} updateData - Fields to update (phone, address, name)
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(userId, role, updateData) {
    const { phone, address, name } = updateData;

    if (['admin', 'staff'].includes(role)) {
      const updates = [];
      const params = [];

      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }

      if (updates.length > 0) {
        params.push(userId);
        await query(
          `UPDATE staffs SET ${updates.join(', ')} WHERE account_id = ?`,
          params
        );
      }
    } else if (role === 'client') {
      const updates = [];
      const params = [];

      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      if (address !== undefined) {
        updates.push('address = ?');
        params.push(address);
      }
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }

      if (updates.length > 0) {
        params.push(userId);
        await query(
          `UPDATE clients SET ${updates.join(', ')} WHERE account_id = ?`,
          params
        );
      }
    } else if (role === 'supplier') {
      const updates = [];
      const params = [];

      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      if (address !== undefined) {
        updates.push('address = ?');
        params.push(address);
      }
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }

      if (updates.length > 0) {
        params.push(userId);
        await query(
          `UPDATE suppliers SET ${updates.join(', ')} WHERE account_id = ?`,
          params
        );
      }
    }

    // Return updated profile
    return this.getProfile(userId, role);
  },

  /**
   * Change user password.
   * @param {number} accountId - Account ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  async changePassword(accountId, currentPassword, newPassword) {
    const AccountModel = require('../models/account.model');
    const { comparePassword, hashPassword } = require('../utils/password');

    // Get account
    const account = await AccountModel.findById(accountId);
    if (!account) {
      const error = new Error('Tài khoản không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, account.password_hash);
    if (!isMatch) {
      const error = new Error('Mật khẩu hiện tại không đúng');
      error.statusCode = 401;
      throw error;
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    const { query } = require('../config/database');
    await query('UPDATE accounts SET password_hash = ? WHERE id = ?', [newHash, accountId]);
  }
};

module.exports = AuthService;
