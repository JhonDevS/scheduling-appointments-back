const logger = require('../utils/logger');

const notFound = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404,
    },
  });
};

module.exports = notFound;
