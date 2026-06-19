const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');

/**
 * Auth Controller - HTTP request handlers for authentication
 */
const AuthController = {
  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email and password are required' }
        });
      }

      const result = await AuthService.authenticate(email, password);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.statusCode === 401) {
        return res.status(401).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * GET /api/auth/profile
   * Get authenticated user's profile.
   * Requires auth middleware (req.user must be set).
   */
  async getProfile(req, res, next) {
    try {
      const { id, role } = req.user;
      const profile = await AuthService.getProfile(id, role);

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/profile
   * Update authenticated user's profile (non-sensitive fields only).
   * Requires auth middleware (req.user must be set).
   */
  async updateProfile(req, res, next) {
    try {
      const { id, role } = req.user;
      const { phone, address, name } = req.body;

      // Reject attempts to change role or status
      if (req.body.role || req.body.status) {
        return res.status(403).json({
          success: false,
          error: { message: 'Cannot modify role or status' }
        });
      }

      const updatedProfile = await AuthService.updateProfile(id, role, {
        phone,
        address,
        name
      });

      res.json({
        success: true,
        data: updatedProfile
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/register
   * Register a new client account (public).
   */
  async register(req, res, next) {
    try {
      const { email, password, name, type, id_number, phone, address } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email, password, and name are required' }
        });
      }

      const client = await UserService.createClient({
        email, password, name,
        type: type || 'Cá nhân',
        id_number: id_number || null,
        phone: phone || null,
        address: address || null
      });

      res.status(201).json({
        success: true,
        data: client
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/auth/change-password
   * Change authenticated user's password.
   * Requires auth middleware (req.user must be set).
   */
  async changePassword(req, res, next) {
    try {
      const { id } = req.user;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: { message: 'Current password and new password are required' }
        });
      }

      await AuthService.changePassword(id, currentPassword, newPassword);

      res.json({
        success: true,
        data: { message: 'Password changed successfully' }
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/auth/forgot-password
   * Public endpoint to reset password by verifying email and phone.
   */
  async forgotPassword(req, res, next) {
    try {
      const { email, phone, newPassword } = req.body;

      if (!email || !phone || !newPassword) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email, số điện thoại và mật khẩu mới là bắt buộc' }
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }
        });
      }

      const { query } = require('../config/database');
      const bcrypt = require('bcryptjs');
      const { getAdminAccountIds, notify } = require('../utils/notificationHelpers');

      // Check account existence
      const accounts = await query('SELECT id, role FROM accounts WHERE email = ?', [email]);
      if (accounts.length === 0) {
        return res.status(404).json({
          success: false,
          error: { message: 'Không tìm thấy tài khoản với email này.' }
        });
      }

      const account = accounts[0];
      let phoneVerified = false;
      let userName = '';

      if (account.role === 'admin' || account.role === 'staff') {
        const staffs = await query('SELECT phone, name FROM staffs WHERE account_id = ?', [account.id]);
        if (staffs.length > 0 && staffs[0].phone === phone) {
          phoneVerified = true;
          userName = staffs[0].name;
        }
      } else if (account.role === 'client') {
        const clients = await query('SELECT phone, name FROM clients WHERE account_id = ?', [account.id]);
        if (clients.length > 0 && clients[0].phone === phone) {
          phoneVerified = true;
          userName = clients[0].name;
        }
      } else if (account.role === 'supplier') {
        const suppliers = await query('SELECT phone, name FROM suppliers WHERE account_id = ?', [account.id]);
        if (suppliers.length > 0 && suppliers[0].phone === phone) {
          phoneVerified = true;
          userName = suppliers[0].name;
        }
      }

      if (!phoneVerified) {
        return res.status(400).json({
          success: false,
          error: { message: 'Số điện thoại xác nhận không khớp với tài khoản.' }
        });
      }

      // Hash password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query('UPDATE accounts SET password_hash = ? WHERE id = ?', [hashedPassword, account.id]);

      // Notify admins
      const adminIds = await getAdminAccountIds();
      await notify(adminIds, {
        type: 'password_reset',
        title: 'Khôi phục mật khẩu thành công',
        message: `Tài khoản ${email} (${userName || 'Người dùng'}) đã đặt lại mật khẩu mới thành công.`,
        related_type: 'account',
        related_id: String(account.id)
      });

      res.json({
        success: true,
        message: 'Đặt lại mật khẩu thành công!'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
