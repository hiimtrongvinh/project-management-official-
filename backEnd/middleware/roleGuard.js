/**
 * Middleware factory for role-based access control.
 * Returns middleware that checks req.user.role against the allowed roles.
 * Returns 403 if the user's role is not in the allowed list.
 *
 * @param  {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. Not authenticated.' }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. Insufficient permissions.' }
      });
    }

    next();
  };
}

module.exports = authorize;
