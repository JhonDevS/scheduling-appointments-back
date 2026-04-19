/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
const logger = require('../utils/logger');

// Database configuration
const getSequelizeConfig = () => ({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'scheduling_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true',
  logging: msg => logger.debug(msg),
  pool: {
    max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
  },
});

// Create Sequelize instance
const sequelize = new Sequelize(getSequelizeConfig());

// Configure Umzug - context is the sequelize instance itself
const umzug = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: __dirname, ignore: ['index.js'] }],
  },
  storage: new SequelizeStorage({
    sequelize,
    tableName: 'sequelizemetadata',
  }),
  context: sequelize.getQueryInterface(),
  logger,
});

/**
 * Run pending migrations
 * @param {boolean} force - Force run all migrations
 * @returns {Promise} Migration results
 */
const runMigrations = async (force = false) => {
  try {
    if (force) {
      logger.warn('Force running all migrations...');
      const applied = await umzug.up();
      logger.info(`Applied ${applied.length} migrations`);
      return applied;
    }

    const pending = await umzug.pending();
    if (pending.length === 0) {
      logger.info('No pending migrations to run');
      return [];
    }

    logger.info(`Running ${pending.length} pending migrations...`);
    const applied = await umzug.up();
    logger.info(`Applied ${applied.length} migrations`);

    return applied;
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

/**
 * Check migrations status
 * @returns {Promise} Pending migrations
 */
const checkMigrations = async () => {
  try {
    const pending = await umzug.pending();
    return pending;
  } catch (error) {
    logger.error('Error checking migrations:', error);
    return [];
  }
};

/**
 * List executed migrations
 * @returns {Promise} Executed migrations
 */
const getExecutedMigrations = async () => {
  try {
    const executed = await umzug.executed();
    return executed;
  } catch (error) {
    logger.error('Error getting executed migrations:', error);
    return [];
  }
};

module.exports = {
  sequelize,
  umzug,
  runMigrations,
  checkMigrations,
  getExecutedMigrations,
};
