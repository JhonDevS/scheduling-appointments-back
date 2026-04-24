const userService = require('../services/userService');
const response = require('../utils/response');

const authController = {
  async register(req, res, _) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(res, 400, 'Email and password are required');
      }

      if (password.length < 6) {
        return response.error(res, 400, 'Password must be at least 6 characters');
      }

      const user = await userService.register(email, password);
      return response.success(res, 201, 'User registered successfully', user);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async login(req, res, _) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(res, 400, 'Email and password are required');
      }

      const result = await userService.login(email, password);
      return response.success(res, 200, 'Login successful', result);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },
};

module.exports = authController;
