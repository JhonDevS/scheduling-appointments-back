const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No token provided',
          statusCode: 401,
        },
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    logger.error('JWT validation error:', error);
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        statusCode: 401,
      },
    });
  }
};

module.exports = authMiddleware;
