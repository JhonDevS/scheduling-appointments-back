const healthService = require('../services/healthService');

const healthController = {
  /**
   * Check service health
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {function} next - Express next function
   */
  async check(req, res, next) {
    try {
      const health = await healthService.check();
      res.status(200).json(health);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = healthController;
