const { User } = require('../models');
const logger = require('../utils/logger');

const userDao = {
  async create(userData) {
    try {
      const user = await User.create(userData);
      logger.info(`User created with id: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      logger.error('Error finding user by id:', error);
      throw error;
    }
  },
};

module.exports = userDao;
