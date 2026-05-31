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

      // Mantener compatibilidad con el front: data puede ser solo el usuario,
      // y opcionalmente incluir token si en el futuro se decide hacer auto-login.
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

      // El front espera: { success, message, data: { usuario, token } }
      // y el axios interceptor entrega directamente este objeto.
      return response.success(res, 200, 'Login exitoso', result);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async logout(_req, res, _) {
    // Por ahora no hay blacklist de tokens: devolvemos éxito siempre.
    return response.success(res, 200, 'Logout exitoso');
  },

  async forgotPassword(req, res, _) {
    try {
      const { email } = req.body;

      if (!email) {
        return response.error(res, 400, 'Email es requerido');
      }

      // En esta versión universitaria no implementamos el flujo completo de reset.
      // Simplemente registramos la intención y devolvemos success=true.
      await userService.requestPasswordReset(email);

      return response.success(
        res,
        200,
        'Si el correo existe, se ha enviado un enlace de recuperación'
      );
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async oauth(req, res, _) {
    try {
      const { provider, email, name, credential } = req.body;

      if (!provider || !email) {
        return response.error(res, 400, 'Proveedor y email son requeridos');
      }

      const result = await userService.loginWithOAuth({ provider, email, name, credential });

      return response.success(res, 200, 'Login social exitoso', result);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },
};

module.exports = authController;
