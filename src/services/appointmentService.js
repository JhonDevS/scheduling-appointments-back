const appointmentDao = require('../dao/appointmentDao');
const { EstadosCita } = require('../models');

const DEFAULT_ESTADO = 'confirmed';

const appointmentService = {
  async listAppointments({ usuarioId, roles, start, end }) {
    const startDate = start ? new Date(start).toISOString().slice(0, 10) : undefined;
    const endDate = end ? new Date(end).toISOString().slice(0, 10) : undefined;

    const citas = await appointmentDao.findAllByScope({ usuarioId, roles, startDate, endDate });

    return citas.map(this.toDto);
  },

  async getAppointmentById({ id, usuarioId, roles }) {
    const cita = await appointmentDao.findById(id);
    if (!cita || cita.eliminado) {
      const error = new Error('Cita no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = roles.includes('admin');
    const isDoctor = roles.includes('doctor');
    if (!isAdmin) {
      if (isDoctor && cita.medico_id !== usuarioId) {
        const error = new Error('No tienes permiso para ver esta cita');
        error.statusCode = 403;
        throw error;
      }
      if (!isDoctor && cita.paciente_id !== usuarioId) {
        const error = new Error('No tienes permiso para ver esta cita');
        error.statusCode = 403;
        throw error;
      }
    }

    return this.toDto(cita);
  },

  async createAppointment({ usuarioId, roles, payload }) {
    const isAdmin = roles.includes('admin');
    const isDoctor = roles.includes('doctor');

    const pacienteId = isAdmin || isDoctor ? payload.pacienteId || usuarioId : usuarioId;
    const { medicoId } = payload;

    if (!medicoId) {
      const error = new Error('El médico es requerido para crear una cita');
      error.statusCode = 400;
      throw error;
    }

    const fecha = new Date(payload.start).toISOString().slice(0, 10);
    const horaInicio = new Date(payload.start).toISOString().slice(11, 19);
    const horaFin = new Date(payload.end).toISOString().slice(11, 19);

    const estado = await EstadosCita.findOne({ where: { nombre: DEFAULT_ESTADO } });
    const estadoId = estado ? estado.id : 1;

    const cita = await appointmentDao.create({
      paciente_id: pacienteId,
      medico_id: medicoId,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      estado_id: estadoId,
      notas_medicas: payload.notes || null,
    });

    return this.toDto(cita);
  },

  async updateAppointment({ id, usuarioId, roles, payload }) {
    const existing = await appointmentDao.findById(id);
    if (!existing || existing.eliminado) {
      const error = new Error('Cita no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = roles.includes('admin');
    const isDoctor = roles.includes('doctor');
    if (!isAdmin) {
      if (isDoctor && existing.medico_id !== usuarioId) {
        const error = new Error('No tienes permiso para modificar esta cita');
        error.statusCode = 403;
        throw error;
      }
      if (!isDoctor && existing.paciente_id !== usuarioId) {
        const error = new Error('No tienes permiso para modificar esta cita');
        error.statusCode = 403;
        throw error;
      }
    }

    const updates = {};
    if (payload.start && payload.end) {
      updates.fecha = new Date(payload.start).toISOString().slice(0, 10);
      updates.hora_inicio = new Date(payload.start).toISOString().slice(11, 19);
      updates.hora_fin = new Date(payload.end).toISOString().slice(11, 19);
    }
    if (payload.notes !== undefined) {
      updates.notas_medicas = payload.notes;
    }

    const updated = await appointmentDao.update(id, updates);
    return this.toDto(updated);
  },

  async deleteAppointment({ id, usuarioId, roles }) {
    const existing = await appointmentDao.findById(id);
    if (!existing || existing.eliminado) {
      const error = new Error('Cita no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = roles.includes('admin');
    const isDoctor = roles.includes('doctor');
    if (!isAdmin) {
      if (isDoctor && existing.medico_id !== usuarioId) {
        const error = new Error('No tienes permiso para cancelar esta cita');
        error.statusCode = 403;
        throw error;
      }
      if (!isDoctor && existing.paciente_id !== usuarioId) {
        const error = new Error('No tienes permiso para cancelar esta cita');
        error.statusCode = 403;
        throw error;
      }
    }

    await appointmentDao.softDelete(id);
    return true;
  },

  toDto(cita) {
    const plain = cita.toJSON();
    const startISOString = `${plain.fecha}T${plain.hora_inicio}`;
    const endISOString = `${plain.fecha}T${plain.hora_fin}`;

    return {
      id: plain.id,
      title: plain.titulo || 'Cita médica',
      start: startISOString,
      end: endISOString,
      status: plain.estado?.nombre || 'confirmed',
      notes: plain.notas_medicas || null,
      patientId: plain.paciente_id,
      patientName: plain.paciente?.nombreCompleto || null,
      patientEmail: plain.paciente?.email || null,
      doctorId: plain.medico_id,
      doctorName: plain.medico?.nombreCompleto || null,
      doctorEmail: plain.medico?.email || null,
    };
  },
};

module.exports = appointmentService;
