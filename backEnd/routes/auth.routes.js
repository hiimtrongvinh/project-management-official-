const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth');

// Validation rules for login
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Validation middleware to check results
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map(e => ({ field: e.path, message: e.msg }))
      }
    });
  }
  next();
}

// POST /api/auth/register - Register new client (public)
router.post('/register', AuthController.register);

// POST /api/auth/login - Authenticate user
router.post('/login', loginValidation, handleValidationErrors, AuthController.login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', authenticate, AuthController.getProfile);

// PUT /api/auth/profile - Update current user profile (protected)
router.put('/profile', authenticate, AuthController.updateProfile);

// POST /api/auth/change-password - Change password (protected)
router.post('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
