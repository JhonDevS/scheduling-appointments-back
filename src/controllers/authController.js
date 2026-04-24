const userService = require('../services/userService');
const response = require('../utils/response');

const authController = {
  async register(req, res, _) {
    try {
      const { email, password, nombreCompleto } = req.body;

      if (!email || !password) {
        return response.error(res, 400, 'Email y contraseña son requeridos');
      }

      if (!nombreCompleto) {
        return response.error(res, 400, 'Nombre completo es requerido');
      }

      if (password.length < 6) {
        return response.error(res, 400, 'La contraseña debe tener al menos 6 caracteres');
      }

      const usuario = await userService.register(email, password, nombreCompleto);
      return response.success(res, 201, 'Usuario registrado exitosamente', usuario);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async login(req, res, _) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return response.error(res, 400, 'Email y contraseña son requeridos');
      }

      const result = await userService.login(email, password);
      return response.success(res, 200, 'Login exitoso', result);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },
};

module.exports = authController;
