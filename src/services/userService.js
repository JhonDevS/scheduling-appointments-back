const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');
const logger = require('../utils/logger');
const { UsuarioRol, Rol } = require('../models');

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

      const roles = await this.getUsuarioRoles(usuario.id);

      return {
        id: usuario.id,
        email: usuario.email,
        nombreCompleto: usuario.nombreCompleto,
        roles,
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

      const roles = await this.getUsuarioRoles(usuario.id);

      const token = this.generateToken(usuario, roles);

      logger.info(`Usuario inició sesión: ${usuario.id}`);

      return {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombreCompleto: usuario.nombreCompleto,
          roles,
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

  generateToken(usuario, roles) {
    const payload = {
      usuarioId: usuario.id,
      email: usuario.email,
      nombreCompleto: usuario.nombreCompleto,
      roles,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
  },

  async getUsuarioRoles(usuarioId) {
    const asignaciones = await UsuarioRol.findAll({ where: { usuario_id: usuarioId } });
    if (!asignaciones.length) return [];

    const rolIds = asignaciones.map(a => a.rol_id);
    const roles = await Rol.findAll({ where: { id: rolIds } });

    // Usamos el nombre tal cual está en la tabla, esperando patient/doctor/admin, pero
    // esto queda flexible para nuevos roles.
    return roles.map(r => r.nombre);
  },

  async requestPasswordReset(email) {
    // Versión simplificada: solo registramos en logs.
    logger.info(`Solicitud de recuperación de contraseña para: ${email}`);
    return true;
  },

  async loginWithOAuth({ provider, email, name }) {
    try {
      let usuario = await userDao.findByEmail(email);

      if (!usuario) {
        const nombreCompleto = name || email.split('@')[0];
        // Creamos un usuario sin contraseña real (solo para entorno académico).
        const fakePasswordHash = await bcrypt.hash(`oauth-${provider}-${Date.now()}`, 10);

        usuario = await userDao.create({
          email,
          password_hash: fakePasswordHash,
          nombreCompleto,
        });
      }

      const roles = await this.getUsuarioRoles(usuario.id);

      const token = this.generateToken(usuario, roles);

      logger.info(`Usuario OAuth (${provider}) inició sesión: ${usuario.id}`);

      return {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombreCompleto: usuario.nombreCompleto,
          roles,
          createdAt: usuario.created_at,
          updatedAt: usuario.updated_at,
        },
        token,
      };
    } catch (error) {
      logger.error('Error en login OAuth:', error);
      throw error;
    }
  },
};

module.exports = userService;
