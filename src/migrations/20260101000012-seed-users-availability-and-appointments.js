const bcrypt = require('bcryptjs');

module.exports = {
  async up({ context: queryInterface }) {
    const { sequelize } = queryInterface;

    // Password hash for '1234'
    const passwordHash = await bcrypt.hash('1234', 10);
    const now = new Date();

    // 1) Insert default users: admin, doctor, patient
    await queryInterface.bulkInsert('usuarios', [
      {
        email: 'admin@saludya.com',
        password_hash: passwordHash,
        nombre_completo: 'Administrador SaludYa',
        telefono: '+573001112233',
        fecha_registro: now,
        activo: true,
        eliminado: false,
        created_at: now,
        updated_at: now,
      },
      {
        email: 'doctor@saludya.com',
        password_hash: passwordHash,
        nombre_completo: 'Dr. Demo SaludYa',
        telefono: '+573002223344',
        fecha_registro: now,
        activo: true,
        eliminado: false,
        created_at: now,
        updated_at: now,
      },
      {
        email: 'paciente@saludya.com',
        password_hash: passwordHash,
        nombre_completo: 'Paciente Demo SaludYa',
        telefono: '+573003334455',
        fecha_registro: now,
        activo: true,
        eliminado: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    // Get inserted user IDs
    const [usuarios] = await sequelize.query(
      "SELECT id, email FROM usuarios WHERE email IN ('admin@saludya.com','doctor@saludya.com','paciente@saludya.com');"
    );

    const admin = usuarios.find(u => u.email === 'admin@saludya.com');
    const doctor = usuarios.find(u => u.email === 'doctor@saludya.com');
    const patient = usuarios.find(u => u.email === 'paciente@saludya.com');

    // 2) Map roles to users via usuarios_roles
    const [roles] = await sequelize.query(
      "SELECT id, nombre FROM roles WHERE nombre IN ('admin','doctor','patient');"
    );

    const adminRole = roles.find(r => r.nombre === 'admin');
    const doctorRole = roles.find(r => r.nombre === 'doctor');
    const patientRole = roles.find(r => r.nombre === 'patient');

    const usuarioRoles = [];
    if (admin && adminRole) {
      usuarioRoles.push({
        usuario_id: admin.id,
        rol_id: adminRole.id,
        created_at: now,
        updated_at: now,
      });
    }
    if (doctor && doctorRole) {
      usuarioRoles.push({
        usuario_id: doctor.id,
        rol_id: doctorRole.id,
        created_at: now,
        updated_at: now,
      });
    }
    if (patient && patientRole) {
      usuarioRoles.push({
        usuario_id: patient.id,
        rol_id: patientRole.id,
        created_at: now,
        updated_at: now,
      });
    }

    if (usuarioRoles.length > 0) {
      await queryInterface.bulkInsert('usuarios_roles', usuarioRoles);
    }

    // 3) Seed appointment statuses if empty
    const [estadoRows] = await sequelize.query('SELECT COUNT(*) AS c FROM estados_cita;');
    const countEstados = Number(estadoRows[0].c || estadoRows[0].C || 0);

    if (countEstados === 0) {
      await queryInterface.bulkInsert('estados_cita', [
        { nombre: 'pending', descripcion: 'Pendiente', created_at: now, updated_at: now },
        { nombre: 'confirmed', descripcion: 'Confirmada', created_at: now, updated_at: now },
        { nombre: 'cancelled', descripcion: 'Cancelada', created_at: now, updated_at: now },
        { nombre: 'completed', descripcion: 'Completada', created_at: now, updated_at: now },
      ]);
    }

    // Get confirmed status id
    const [estados] = await sequelize.query(
      "SELECT id, nombre FROM estados_cita WHERE nombre IN ('confirmed','pending','cancelled','completed');"
    );
    const confirmed = estados.find(e => e.nombre === 'confirmed') || estados[0];

    // 4) Seed default availability for doctor: Monday–Friday 09:00–17:00, 30 min
    if (doctor) {
      const baseSlots = [];
      for (let day = 1; day <= 5; day += 1) {
        baseSlots.push({
          medico_id: doctor.id,
          dia_semana: day,
          hora_inicio: '09:00:00',
          hora_fin: '17:00:00',
          duracion_minutos: 30,
          activo: true,
          created_at: now,
          updated_at: now,
        });
      }
      await queryInterface.bulkInsert('horarios_base', baseSlots);
    }

    // 5) Seed a couple of demo appointments
    if (doctor && patient && confirmed) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const fecha = `${yyyy}-${mm}-${dd}`;

      await queryInterface.bulkInsert('citas', [
        {
          paciente_id: patient.id,
          medico_id: doctor.id,
          fecha,
          hora_inicio: '10:00:00',
          hora_fin: '10:30:00',
          estado_id: confirmed.id,
          notas_medicas: 'Consulta inicial de demostración',
          activo: true,
          eliminado: false,
          created_at: now,
          updated_at: now,
          titulo: 'Consulta inicial',
        },
        {
          paciente_id: patient.id,
          medico_id: doctor.id,
          fecha,
          hora_inicio: '11:00:00',
          hora_fin: '11:30:00',
          estado_id: confirmed.id,
          notas_medicas: 'Control de seguimiento demo',
          activo: true,
          eliminado: false,
          created_at: now,
          updated_at: now,
          titulo: 'Seguimiento',
        },
      ]);
    }
  },

  async down({ context: queryInterface }) {
    await queryInterface.bulkDelete('citas', null, {});
    await queryInterface.bulkDelete('horarios_base', null, {});
    await queryInterface.bulkDelete('usuarios_roles', null, {});
    await queryInterface.bulkDelete('usuarios', {
      email: ['admin@saludya.com', 'doctor@saludya.com', 'paciente@saludya.com'],
    });

    // Estados y roles/permisos se controlan en sus propias migraciones de seed
  },
};
