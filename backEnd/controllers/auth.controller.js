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
  }
};

module.exports = AuthController;
