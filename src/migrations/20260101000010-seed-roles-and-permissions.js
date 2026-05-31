module.exports = {
  async up({ context: queryInterface }) {
    // Seed base roles
    await queryInterface.bulkInsert('roles', [
      {
        nombre: 'patient',
        descripcion: 'Paciente',
        created_at: new Date(),
        updated_at: new Date(),
      },
      { nombre: 'doctor', descripcion: 'Doctor', created_at: new Date(), updated_at: new Date() },
      {
        nombre: 'admin',
        descripcion: 'Administrador',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Seed some base permissions aligned with frontend routes
    await queryInterface.bulkInsert('permisos', [
      {
        nombre_clave: 'appointments:patient',
        descripcion: 'Gestionar citas propias como paciente',
        endpoint: '/api/v1/appointments',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre_clave: 'appointments:doctor',
        descripcion: 'Gestionar citas de pacientes como doctor',
        endpoint: '/api/v1/doctor/appointments',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nombre_clave: 'admin:users',
        descripcion: 'Administrar usuarios desde el portal admin',
        endpoint: '/api/v1/admin/users',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // NOTE: roles_permisos se pueden poblar en una migración posterior una vez
    // que tengamos definidos todos los endpoints protegidos. Por ahora solo
    // dejamos sembrados roles y permisos base.
  },

  async down({ context: queryInterface }) {
    await queryInterface.bulkDelete('roles_permisos', null, {});
    await queryInterface.bulkDelete('permisos', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  },
};
