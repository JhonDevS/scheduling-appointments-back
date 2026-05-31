module.exports = {
  async up({ context: queryInterface }) {
    const { sequelize } = queryInterface;
    const now = new Date();

    // Obtener roles base
    const [roles] = await sequelize.query(
      "SELECT id, nombre FROM roles WHERE nombre IN ('admin','doctor','patient');"
    );

    const adminRole = roles.find(r => r.nombre === 'admin');
    const doctorRole = roles.find(r => r.nombre === 'doctor');
    const patientRole = roles.find(r => r.nombre === 'patient');

    // Obtener permisos base definidos en 20260101000010-seed-roles-and-permissions
    const [permisos] = await sequelize.query(
      "SELECT id, nombre_clave FROM permisos WHERE nombre_clave IN ('appointments:patient','appointments:doctor','admin:users');"
    );

    const permAppointmentsPatient = permisos.find(p => p.nombre_clave === 'appointments:patient');
    const permAppointmentsDoctor = permisos.find(p => p.nombre_clave === 'appointments:doctor');
    const permAdminUsers = permisos.find(p => p.nombre_clave === 'admin:users');

    const rows = [];

    // Paciente: solo puede gestionar sus propias citas
    if (patientRole && permAppointmentsPatient) {
      rows.push({
        rol_id: patientRole.id,
        permiso_id: permAppointmentsPatient.id,
        created_at: now,
        updated_at: now,
      });
    }

    // Doctor: gestionar citas como doctor
    if (doctorRole && permAppointmentsDoctor) {
      rows.push({
        rol_id: doctorRole.id,
        permiso_id: permAppointmentsDoctor.id,
        created_at: now,
        updated_at: now,
      });
    }

    // Admin: permisos de admin, y también ver/gestionar citas de ambos tipos
    if (adminRole) {
      if (permAdminUsers) {
        rows.push({
          rol_id: adminRole.id,
          permiso_id: permAdminUsers.id,
          created_at: now,
          updated_at: now,
        });
      }
      if (permAppointmentsPatient) {
        rows.push({
          rol_id: adminRole.id,
          permiso_id: permAppointmentsPatient.id,
          created_at: now,
          updated_at: now,
        });
      }
      if (permAppointmentsDoctor) {
        rows.push({
          rol_id: adminRole.id,
          permiso_id: permAppointmentsDoctor.id,
          created_at: now,
          updated_at: now,
        });
      }
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('roles_permisos', rows);
    }
  },

  async down({ context: queryInterface }) {
    await queryInterface.bulkDelete('roles_permisos', null, {});
  },
};
