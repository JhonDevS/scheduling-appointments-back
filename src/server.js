require('dotenv').config();

const app = require('./app');
const logger = require('./utils/logger');
const { testConnection } = require('./dao/database');
const { runMigrations, checkMigrations } = require('./migrations');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      try {
        await testConnection();
        logger.info('Database connection established');

        const pending = await checkMigrations();
        if (pending.length > 0) {
          logger.info(`Found ${pending.length} pending migrations, running...`);
          await runMigrations();
          logger.info('Migrations completed successfully');
        } else {
          logger.info('Database is up to date');
        }
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
