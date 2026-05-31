const { sequelize, Usuario, UsuarioRol, Rol } = require('../models');
const logger = require('../utils/logger');

const adminUserDao = {
  async listUsers() {
    // Incluir el rol principal del usuario mediante join con usuarios_roles y roles
    const [rows] = await sequelize.query(
      `SELECT u.id, u.email, u.nombre_completo AS "nombreCompleto", u.telefono,
              u.activo, u.eliminado, r.nombre AS role
         FROM usuarios u
         LEFT JOIN usuarios_roles ur ON ur.usuario_id = u.id
         LEFT JOIN roles r ON r.id = ur.rol_id
        WHERE u.eliminado = false;`
    );
    return rows;
  },

  async createUser(usuarioData) {
    try {
      const usuario = await Usuario.create(usuarioData);
      return usuario;
    } catch (error) {
      logger.error('Error creating admin user:', error);
      throw error;
    }
  },

  async updateUser(id, patch) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario || usuario.eliminado) return null;
    await usuario.update(patch);
    return usuario;
  },

  async softDeleteUser(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario || usuario.eliminado) return null;
    await usuario.update({ activo: false, eliminado: true });
    return usuario;
  },

  async setRole(usuarioId, roleName) {
    const rol = await Rol.findOne({ where: { nombre: roleName } });
    if (!rol) {
      throw new Error(`Rol no encontrado: ${roleName}`);
    }

    await UsuarioRol.destroy({ where: { usuario_id: usuarioId } });
    await UsuarioRol.create({ usuario_id: usuarioId, rol_id: rol.id });
  },
};

module.exports = adminUserDao;
