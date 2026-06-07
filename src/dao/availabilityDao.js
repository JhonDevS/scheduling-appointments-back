const { HorarioBase, ExcepcionesHorario } = require('../models');
const logger = require('../utils/logger');

const availabilityDao = {
  async createDefaultForDoctor(medicoId) {
    try {
      const baseSlots = [];
      const duracion = 30; // minutos

      // Lunes (1) a viernes (5), 09:00-17:00
      for (let day = 1; day <= 5; day += 1) {
        baseSlots.push({
          medico_id: medicoId,
          dia_semana: day,
          hora_inicio: '09:00:00',
          hora_fin: '17:00:00',
          duracion_minutos: duracion,
        });
      }

      await HorarioBase.bulkCreate(baseSlots);
    } catch (error) {
      logger.error('Error creating default availability for doctor:', error);
      throw error;
    }
  },

  async listBaseForDoctor(medicoId) {
    return HorarioBase.findAll({ where: { medico_id: medicoId, activo: true } });
  },

  async addBaseSlot({ medicoId, diaSemana, horaInicio, horaFin, duracionMinutos }) {
    return HorarioBase.create({
      medico_id: medicoId,
      dia_semana: diaSemana,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      duracion_minutos: duracionMinutos,
    });
  },

  async listExceptionsForDoctor(medicoId) {
    return ExcepcionesHorario.findAll({ where: { medico_id: medicoId } });
  },
};

module.exports = availabilityDao;
