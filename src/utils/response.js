const response = {
  /**
   * Success response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {any} data - Response data
   * @returns {object} JSON response
   */
  success(res, statusCode = 200, message = 'Success', data = null) {
    const responseObj = {
      success: true,
      message,
    };

    if (data !== null) {
      responseObj.data = data;
    }

    return res.status(statusCode).json(responseObj);
  },

  /**
   * Error response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @returns {object} JSON response
   */
  error(res, statusCode = 500, message = 'Internal Server Error') {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
      },
    });
  },

  /**
   * Paginated response
   * @param {object} res - Express response object
   * @param {array} data - Array of results
   * @param {number} total - Total number of records
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @returns {object} JSON response
   */
  paginated(res, data, total, page, limit) {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
};

module.exports = response;
