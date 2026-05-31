const availabilityDao = require('../dao/availabilityDao');

const availabilityService = {
  async getDoctorBaseSchedule(medicoId) {
    const slots = await availabilityDao.listBaseForDoctor(medicoId);

    return slots.map(slot => ({
      id: slot.id,
      doctorId: slot.medico_id,
      dayOfWeek: slot.dia_semana, // 1-7
      startTime: slot.hora_inicio,
      endTime: slot.hora_fin,
      durationMinutes: slot.duracion_minutos,
    }));
  },

  async addBaseSlot({ medicoId, diaSemana, startTime, endTime, durationMinutes }) {
    const slot = await availabilityDao.addBaseSlot({
      medicoId,
      diaSemana,
      horaInicio: startTime,
      horaFin: endTime,
      duracionMinutos: durationMinutes,
    });

    return {
      id: slot.id,
      doctorId: slot.medico_id,
      dayOfWeek: slot.dia_semana,
      startTime: slot.hora_inicio,
      endTime: slot.hora_fin,
      durationMinutes: slot.duracion_minutos,
    };
  },
};

module.exports = availabilityService;
