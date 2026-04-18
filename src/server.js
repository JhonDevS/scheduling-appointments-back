require('dotenv').config();

const app = require('./app');
const logger = require('./utils/logger');
const { testConnection } = require('./dao/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      try {
        await testConnection();
      } catch (dbError) {
        logger.warn('Database connection unavailable, starting without DB');
      }
    }

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });

    const shutdown = async signal => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);

      server.close(() => {
        logger.info('HTTP server closed');
      });

      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
