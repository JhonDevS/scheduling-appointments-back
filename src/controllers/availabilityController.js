const availabilityService = require('../services/availabilityService');
const response = require('../utils/response');

const availabilityController = {
  async getDoctorBaseSchedule(req, res, _) {
    try {
      const { doctorId } = req.params;
      const medicoId = parseInt(doctorId, 10);

      if (Number.isNaN(medicoId)) {
        return response.error(res, 400, 'doctorId inválido');
      }

      const slots = await availabilityService.getDoctorBaseSchedule(medicoId);
      return response.success(res, 200, 'Horario base obtenido correctamente', slots);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async addDoctorBaseSlot(req, res, _) {
    try {
      const { doctorId } = req.params;
      const medicoId = parseInt(doctorId, 10);
      const { dayOfWeek, startTime, endTime, durationMinutes } = req.body;

      if (Number.isNaN(medicoId)) {
        return response.error(res, 400, 'doctorId inválido');
      }

      if (!dayOfWeek || !startTime || !endTime || !durationMinutes) {
        return response.error(
          res,
          400,
          'Campos requeridos: dayOfWeek, startTime, endTime, durationMinutes'
        );
      }

      const slot = await availabilityService.addBaseSlot({
        medicoId,
        diaSemana: dayOfWeek,
        startTime,
        endTime,
        durationMinutes,
      });

      return response.success(res, 201, 'Bloque de horario creado correctamente', slot);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },
};

module.exports = availabilityController;
