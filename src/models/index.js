const { sequelize, Sequelize } = require('../dao/database');
const Usuario = require('./Usuario')(sequelize);
const Rol = require('./Rol')(sequelize);
const Permiso = require('./Permiso')(sequelize);
const EstadosCita = require('./EstadosCita')(sequelize);
const Cita = require('./Cita')(sequelize);
const HorarioBase = require('./HorarioBase')(sequelize);
const UsuarioRol = require('./UsuarioRol')(sequelize);
const RolPermiso = require('./RolPermiso')(sequelize);
const ExcepcionesHorario = require('./ExcepcionesHorario')(sequelize);

// Associations
// Citas ↔ Usuarios / EstadosCita
Cita.belongsTo(Usuario, { as: 'paciente', foreignKey: 'paciente_id' });
Cita.belongsTo(Usuario, { as: 'medico', foreignKey: 'medico_id' });
Cita.belongsTo(EstadosCita, { as: 'estado', foreignKey: 'estado_id' });

Usuario.hasMany(Cita, { as: 'citasComoPaciente', foreignKey: 'paciente_id' });
Usuario.hasMany(Cita, { as: 'citasComoMedico', foreignKey: 'medico_id' });
EstadosCita.hasMany(Cita, { as: 'citas', foreignKey: 'estado_id' });

const db = {
  sequelize,
  Sequelize,
  Usuario,
  Rol,
  Permiso,
  EstadosCita,
  Cita,
  HorarioBase,
  UsuarioRol,
  RolPermiso,
  ExcepcionesHorario,
};

module.exports = db;
