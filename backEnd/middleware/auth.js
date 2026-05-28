const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to verify JWT token from Authorization header.
 * Extracts Bearer token, verifies it, and attaches decoded payload to req.user.
 * Returns 401 if no token provided or token is invalid/expired.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Access denied. No token provided.' }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token.' }
    });
  }
}

module.exports = authenticate;
