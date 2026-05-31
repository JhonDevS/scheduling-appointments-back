const authorize = requiredRoles => (req, res, next) => {
  const roles = req.user?.roles || [];

  if (!requiredRoles || requiredRoles.length === 0) {
    return next();
  }

  const hasRole = roles.some(r => requiredRoles.includes(r));

  if (!hasRole) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Forbidden: insufficient role',
        statusCode: 403,
      },
    });
  }

  return next();
};

module.exports = authorize;
