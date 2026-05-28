const { pool, query } = require('../config/database');
const AccountModel = require('../models/account.model');
const StaffModel = require('../models/staff.model');
const ClientModel = require('../models/client.model');
const SupplierModel = require('../models/supplier.model');
const { hashPassword } = require('../utils/password');
const { generateStaffId, generateClientId, generateSupplierId } = require('../utils/helpers');

/**
 * User Service - Business logic for user management (staff, clients, suppliers)
 */
const UserService = {
  /**
   * Create a new staff account and profile in a transaction.
   * Generates unique staff ID (NVxxx), creates account with hashed password, then creates staff record.
   * @param {Object} data - { email, password, name, department, position, phone }
   * @returns {Promise<Object>} Created staff with account info
   */
  async createStaff(data) {
    const { email, password, name, department, position, phone } = data;

    // Validate email uniqueness
    const existingAccount = await AccountModel.findByEmail(email);
    if (existingAccount) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Generate staff ID before transaction
    const staffId = await generateStaffId();

    // Use transaction for atomicity
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create account
      const [accountResult] = await connection.execute(
        'INSERT INTO accounts (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
        [email, password_hash, 'staff', 'active']
      );
      const accountId = accountResult.insertId;

      // Create staff record
      await connection.execute(
        'INSERT INTO staffs (id, account_id, name, department, position, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [staffId, accountId, name, department || null, position || null, phone || null]
      );

      await connection.commit();

      // Return the created staff record
      return StaffModel.findById(staffId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Create a new client account and profile in a transaction.
   * Generates unique client ID (KHxxx), creates account with hashed password, then creates client record.
   * @param {Object} data - { email, password, type, id_number, name, phone, address }
   * @returns {Promise<Object>} Created client with account info
   */
  async createClient(data) {
    const { email, password, type, id_number, name, phone, address } = data;

    // Validate email uniqueness
    const existingAccount = await AccountModel.findByEmail(email);
    if (existingAccount) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Generate client ID before transaction
    const clientId = await generateClientId();

    // Use transaction for atomicity
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create account
      const [accountResult] = await connection.execute(
        'INSERT INTO accounts (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
        [email, password_hash, 'client', 'active']
      );
      const accountId = accountResult.insertId;

      // Create client record
      await connection.execute(
        'INSERT INTO clients (id, account_id, type, id_number, name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [clientId, accountId, type, id_number || null, name, phone || null, address || null]
      );

      await connection.commit();

      // Return the created client record
      return ClientModel.findById(clientId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Create a new supplier account and profile in a transaction.
   * Generates unique supplier ID (NCxxx), creates account with hashed password, then creates supplier record.
   * @param {Object} data - { email, password, id_number, name, phone, address }
   * @returns {Promise<Object>} Created supplier with account info
   */
  async createSupplier(data) {
    const { email, password, id_number, name, phone, address } = data;

    // Validate email uniqueness
    const existingAccount = await AccountModel.findByEmail(email);
    if (existingAccount) {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Generate supplier ID before transaction
    const supplierId = await generateSupplierId();

    // Use transaction for atomicity
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Create account
      const [accountResult] = await connection.execute(
        'INSERT INTO accounts (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
        [email, password_hash, 'supplier', 'active']
      );
      const accountId = accountResult.insertId;

      // Create supplier record
      await connection.execute(
        'INSERT INTO suppliers (id, account_id, id_number, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [supplierId, accountId, id_number || null, name, phone || null, address || null]
      );

      await connection.commit();

      // Return the created supplier record
      return SupplierModel.findById(supplierId);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Get paginated list of users by type.
   * @param {string} type - 'staff', 'client', or 'supplier'
   * @param {Object} filters - Type-specific filters
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page (default 20)
   * @returns {Promise<{data: Array, total: number, page: number, totalPages: number}>}
   */
  async getUsers(type, filters = {}, page = 1, limit = 20) {
    switch (type) {
      case 'staff':
        return StaffModel.findAll(filters, page, limit);
      case 'client':
        return ClientModel.findAll(filters, page, limit);
      case 'supplier':
        return SupplierModel.findAll(filters, page, limit);
      default: {
        const error = new Error('Invalid user type. Must be staff, client, or supplier.');
        error.statusCode = 400;
        throw error;
      }
    }
  },

  /**
   * Update a user profile by type and ID.
   * @param {string} type - 'staff', 'client', or 'supplier'
   * @param {string} id - User ID (NVxxx, KHxxx, or NCxxx)
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated user record
   */
  async updateUser(type, id, data) {
    let user;

    switch (type) {
      case 'staff':
        user = await StaffModel.findById(id);
        if (!user) {
          const error = new Error('Staff not found');
          error.statusCode = 404;
          throw error;
        }
        if (data.password) {
          const password_hash = await hashPassword(data.password);
          await query('UPDATE accounts SET password_hash = ? WHERE id = ?', [password_hash, user.account_id]);
        }
        return StaffModel.update(id, data);

      case 'client':
        user = await ClientModel.findById(id);
        if (!user) {
          const error = new Error('Client not found');
          error.statusCode = 404;
          throw error;
        }
        if (data.password) {
          const password_hash = await hashPassword(data.password);
          await query('UPDATE accounts SET password_hash = ? WHERE id = ?', [password_hash, user.account_id]);
        }
        return ClientModel.update(id, data);

      case 'supplier':
        user = await SupplierModel.findById(id);
        if (!user) {
          const error = new Error('Supplier not found');
          error.statusCode = 404;
          throw error;
        }
        if (data.password) {
          const password_hash = await hashPassword(data.password);
          await query('UPDATE accounts SET password_hash = ? WHERE id = ?', [password_hash, user.account_id]);
        }
        return SupplierModel.update(id, data);

      default: {
        const error = new Error('Invalid user type. Must be staff, client, or supplier.');
        error.statusCode = 400;
        throw error;
      }
    }
  },

  /**
   * Deactivate a user account (soft delete).
   * Sets account status to 'inactive'.
   * @param {string} id - User ID (NVxxx, KHxxx, or NCxxx)
   * @returns {Promise<Object>} Result with deactivated user info
   */
  async deactivateUser(id) {
    // Determine user type from ID prefix
    let user;
    let type;

    if (id.startsWith('NV')) {
      user = await StaffModel.findById(id);
      type = 'staff';
    } else if (id.startsWith('KH')) {
      user = await ClientModel.findById(id);
      type = 'client';
    } else if (id.startsWith('NC')) {
      user = await SupplierModel.findById(id);
      type = 'supplier';
    } else {
      const error = new Error('Invalid user ID format');
      error.statusCode = 400;
      throw error;
    }

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Set account status to inactive
    await AccountModel.updateStatus(user.account_id, 'inactive');

    // If staff, also update staff status
    if (type === 'staff') {
      await StaffModel.update(id, { status: 'Nghỉ việc' });
    }

    return { message: 'User deactivated successfully', id, type };
  }
};

module.exports = UserService;
