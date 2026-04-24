const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');
const logger = require('../utils/logger');

const userService = {
  async register(email, password, nombreCompleto) {
    try {
      const existingUser = await userDao.findByEmail(email);
      if (existingUser) {
        const error = new Error('Ya existe un usuario con este correo electrónico');
        error.statusCode = 409;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const usuario = await userDao.create({
        email,
        password_hash: hashedPassword,
        nombreCompleto: nombreCompleto,
      });

      logger.info(`Usuario registrado: ${usuario.id}`);

      return {
        id: usuario.id,
        email: usuario.email,
        createdAt: usuario.created_at,
        updatedAt: usuario.updated_at,
      };
    } catch (error) {
      logger.error('Error registering usuario:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const usuario = await userDao.findByEmail(email);
      if (!usuario) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
      }

      const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
      if (!isPasswordValid) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
      }

      const token = this.generateToken(usuario.id);

      logger.info(`Usuario inició sesión: ${usuario.id}`);

      return {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          createdAt: usuario.created_at,
          updatedAt: usuario.updated_at,
        },
        token,
      };
    } catch (error) {
      logger.error('Error logging in usuario:', error);
      throw error;
    }
  },

  generateToken(usuarioId) {
    const token = jwt.sign({ usuarioId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  },
};

module.exports = userService;
