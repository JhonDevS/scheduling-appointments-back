const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');
const logger = require('../utils/logger');

const userService = {
  async register(email, password) {
    try {
      const existingUser = await userDao.findByEmail(email);
      if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userDao.create({
        email,
        password: hashedPassword,
      });

      logger.info(`User registered: ${user.id}`);

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const user = await userDao.findByEmail(email);
      if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }

      const token = this.generateToken(user.id);

      logger.info(`User logged in: ${user.id}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      logger.error('Error logging in user:', error);
      throw error;
    }
  },

  generateToken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  },
};

module.exports = userService;
