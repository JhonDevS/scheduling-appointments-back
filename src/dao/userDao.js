const { Usuario } = require('../models');
const logger = require('../utils/logger');

const usuarioDao = {
  async create(usuarioData) {
    try {
      const usuario = await Usuario.create(usuarioData);
      logger.info(`Usuario created with id: ${usuario.id}`);
      return usuario;
    } catch (error) {
      logger.error('Error creating usuario:', error);
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      const usuario = await Usuario.findOne({ where: { email } });
      return usuario;
    } catch (error) {
      logger.error('Error finding usuario by email:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      logger.error('Error finding usuario by id:', error);
      throw error;
    }
  },
};

module.exports = usuarioDao;
