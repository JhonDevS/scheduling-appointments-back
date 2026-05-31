const { Cita, EstadosCita, Usuario } = require('../models');
const logger = require('../utils/logger');

const appointmentDao = {
  async findById(id) {
    try {
      return await Cita.findByPk(id, {
        include: [
          { model: Usuario, as: 'paciente', attributes: ['id', 'email', 'nombreCompleto'] },
          { model: Usuario, as: 'medico', attributes: ['id', 'email', 'nombreCompleto'] },
          { model: EstadosCita, as: 'estado' },
        ],
      });
    } catch (error) {
      logger.error('Error finding cita by id:', error);
      throw error;
    }
  },

  async findAllByScope({ usuarioId, roles, startDate, endDate }) {
    try {
      const where = { eliminado: false };

      const isAdmin = roles.includes('admin');
      const isDoctor = roles.includes('doctor');

      if (!isAdmin) {
        if (isDoctor) {
          where.medico_id = usuarioId;
        } else {
          where.paciente_id = usuarioId;
        }
      }

      if (startDate && endDate) {
        where.fecha = { [Cita.sequelize.Op.between]: [startDate, endDate] };
      }

      return await Cita.findAll({
        where,
        include: [
          { model: Usuario, as: 'paciente', attributes: ['id', 'email', 'nombreCompleto'] },
          { model: Usuario, as: 'medico', attributes: ['id', 'email', 'nombreCompleto'] },
          { model: EstadosCita, as: 'estado' },
        ],
        order: [
          ['fecha', 'ASC'],
          ['hora_inicio', 'ASC'],
        ],
      });
    } catch (error) {
      logger.error('Error finding citas by scope:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      const cita = await Cita.create(data);
      return cita;
    } catch (error) {
      logger.error('Error creating cita:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const cita = await Cita.findByPk(id);
      if (!cita || cita.eliminado) return null;
      await cita.update(data);
      return cita;
    } catch (error) {
      logger.error('Error updating cita:', error);
      throw error;
    }
  },

  async softDelete(id) {
    try {
      const cita = await Cita.findByPk(id);
      if (!cita || cita.eliminado) return null;
      await cita.update({ eliminado: true, activo: false });
      return cita;
    } catch (error) {
      logger.error('Error deleting cita:', error);
      throw error;
    }
  },
};

module.exports = appointmentDao;
