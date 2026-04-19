const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

const sequelize = new Sequelize({
  ...config,
  define: {
    timestamps: true,
    underscored: true,
  },
});

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
};

/**
 * Sync database models (use only in development)
 * @param {object} options - Sequelize sync options
 * @returns {Promise} Sync result
 */
const syncDatabase = async (options = {}) => {
  if (env === 'production' && !options.force) {
    logger.warn('Skipping database sync in production');
    return null;
  }
  return sequelize.sync(options);
};

module.exports = {
  sequelize,
  Sequelize,
  testConnection,
  syncDatabase,
};
