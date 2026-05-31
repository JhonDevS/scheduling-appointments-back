const appointmentService = require('../services/appointmentService');
const response = require('../utils/response');

const appointmentController = {
  async list(req, res, _) {
    try {
      const { start, end } = req.query;
      const data = await appointmentService.listAppointments({
        usuarioId: req.user.id,
        roles: req.user.roles || [],
        start,
        end,
      });

      return response.success(res, 200, 'Citas obtenidas correctamente', data);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async getById(req, res, _) {
    try {
      const { id } = req.params;
      const data = await appointmentService.getAppointmentById({
        id,
        usuarioId: req.user.id,
        roles: req.user.roles || [],
      });

      return response.success(res, 200, 'Cita obtenida correctamente', data);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async create(req, res, _) {
    try {
      const data = await appointmentService.createAppointment({
        usuarioId: req.user.id,
        roles: req.user.roles || [],
        payload: req.body,
      });

      return response.success(res, 201, 'Cita creada correctamente', data);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async update(req, res, _) {
    try {
      const { id } = req.params;
      const data = await appointmentService.updateAppointment({
        id,
        usuarioId: req.user.id,
        roles: req.user.roles || [],
        payload: req.body,
      });

      return response.success(res, 200, 'Cita actualizada correctamente', data);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async remove(req, res, _) {
    try {
      const { id } = req.params;
      await appointmentService.deleteAppointment({
        id,
        usuarioId: req.user.id,
        roles: req.user.roles || [],
      });

      return response.success(res, 200, 'Cita cancelada correctamente');
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },
};

module.exports = appointmentController;
