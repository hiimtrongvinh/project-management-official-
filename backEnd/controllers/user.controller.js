const UserService = require('../services/user.service');

/**
 * User Controller - HTTP handlers for user management
 */
const UserController = {
  /**
   * GET /users/staff - List all staff with pagination
   */
  async getStaff(req, res, next) {
    try {
      const { page = 1, limit = 20, status, department, search } = req.query;
      const filters = {};

      if (status) filters.status = status;
      if (department) filters.department = department;
      if (search) filters.search = search;

      const safePage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
      const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Number(limit)) : 20;

      const result = await UserService.getUsers(
        'staff',
        filters,
        safePage,
        safeLimit
      );

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: parseInt(limit, 10)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /users/clients - List all clients with pagination
   */
  async getClients(req, res, next) {
    try {
      const { page = 1, limit = 20, type, search } = req.query;
      const filters = {};

      if (type) filters.type = type;
      if (search) filters.search = search;

      const safePage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
      const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Number(limit)) : 20;

      const result = await UserService.getUsers(
        'client',
        filters,
        safePage,
        safeLimit
      );

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: parseInt(limit, 10)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /users/suppliers - List all suppliers with pagination
   */
  async getSuppliers(req, res, next) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const filters = {};

      if (search) filters.search = search;

      const safePage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
      const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Number(limit)) : 20;

      const result = await UserService.getUsers(
        'supplier',
        filters,
        safePage,
        safeLimit
      );

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: parseInt(limit, 10)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /users/:type - Create a new user by type
   * type must be 'staff', 'client', or 'supplier'
   */
  async createUser(req, res, next) {
    try {
      const { type } = req.params;
      const data = req.body;

      // Validate type
      if (!['staff', 'client', 'supplier'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid user type. Must be staff, client, or supplier.' }
        });
      }

      // Validate required fields
      if (!data.email || !data.password || !data.name) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email, password, and name are required' }
        });
      }

      if (data.password.length < 6) {
        return res.status(400).json({
          success: false,
          error: { message: 'Password must be at least 6 characters' }
        });
      }

      let result;

      switch (type) {
        case 'staff':
          result = await UserService.createStaff(data);
          break;
        case 'client':
          if (!data.type) {
            return res.status(400).json({
              success: false,
              error: { message: 'Client type is required (Doanh nghiệp, Tổ chức, Cá nhân)' }
            });
          }
          result = await UserService.createClient(data);
          break;
        case 'supplier':
          result = await UserService.createSupplier(data);
          break;
      }

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /users/:id - Update a user by ID
   * Determines user type from ID prefix (NV=staff, KH=client, NC=supplier)
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Determine type from ID prefix
      let type;
      if (id.startsWith('NV')) {
        type = 'staff';
      } else if (id.startsWith('KH')) {
        type = 'client';
      } else if (id.startsWith('NC')) {
        type = 'supplier';
      } else {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid user ID format. Must start with NV, KH, or NC.' }
        });
      }

      // Authorization check: admin or the user themselves
      if (req.user.role !== 'admin') {
        let accountId = null;
        if (type === 'staff') {
          const StaffModel = require('../models/staff.model');
          const staff = await StaffModel.findById(id);
          if (staff) accountId = staff.account_id;
        } else if (type === 'client') {
          const ClientModel = require('../models/client.model');
          const client = await ClientModel.findById(id);
          if (client) accountId = client.account_id;
        } else if (type === 'supplier') {
          const SupplierModel = require('../models/supplier.model');
          const supplier = await SupplierModel.findById(id);
          if (supplier) accountId = supplier.account_id;
        }

        if (accountId !== req.user.id) {
          return res.status(403).json({
            success: false,
            error: { message: 'Forbidden: You do not have permission to update this user' }
          });
        }

        // Prevent non-admin from updating sensitive fields
        delete data.department;
        delete data.position;
        delete data.status;
        delete data.role;
      }

      const result = await UserService.updateUser(type, id, data);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /users/:id - Deactivate a user (soft delete)
   * Determines user type from ID prefix
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await UserService.deactivateUser(id);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /users/:id/avatar - Upload avatar for a staff member
   */
  async uploadAvatar(req, res, next) {
    try {
      const { id } = req.params;

      if (req.user.role !== 'admin') {
        const StaffModel = require('../models/staff.model');
        const staff = await StaffModel.findById(id);
        if (!staff || staff.account_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            error: { message: 'Forbidden: You do not have permission to upload avatar for this user' }
          });
        }
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No file uploaded' }
        });
      }

      const avatarPath = `/uploads/${req.file.filename}`;

      // Update staff avatar field
      const result = await UserService.updateUser('staff', id, { avatar: avatarPath });

      res.json({
        success: true,
        data: { avatar: avatarPath, staff: result }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = UserController;
