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
