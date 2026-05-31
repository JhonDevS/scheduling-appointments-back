const bcrypt = require('bcryptjs');
const adminUserDao = require('../dao/adminUserDao');
const availabilityDao = require('../dao/availabilityDao');

const adminUserService = {
  async listUsers() {
    const usuarios = await adminUserDao.listUsers();
    return usuarios.map(u => ({
      id: u.id,
      name: u.nombreCompleto,
      email: u.email,
      phone: u.telefono,
      role: u.role || 'patient',
      status: u.activo ? 'active' : 'suspended',
    }));
  },

  async createUser(payload) {
    const {
      name,
      email,
      phone,
      role,
      status = 'active',
      specialty,
      identification,
      contractNumber,
      password,
    } = payload;

    if (!name || !email || !password) {
      const error = new Error('Nombre, correo y contraseña son obligatorios');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await adminUserDao.createUser({
      email,
      password_hash: hashedPassword,
      nombreCompleto: name,
      telefono: phone || null,
      activo: status !== 'suspended',
    });

    if (role) {
      await adminUserDao.setRole(usuario.id, role);
    }

    if (role === 'doctor') {
      await availabilityDao.createDefaultForDoctor(usuario.id);
    }

    return {
      id: usuario.id,
      name,
      email,
      phone: phone || '',
      role,
      status,
      specialty: specialty || '',
      identification: identification || '',
      contractNumber: contractNumber || '',
    };
  },

  async updateUser(id, payload) {
    const { name, email, phone, role, status } = payload;

    const patch = {};
    if (name !== undefined) patch.nombreCompleto = name;
    if (email !== undefined) patch.email = email;
    if (phone !== undefined) patch.telefono = phone;
    if (status !== undefined) patch.activo = status === 'active';

    const usuario = await adminUserDao.updateUser(id, patch);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (role) {
      await adminUserDao.setRole(usuario.id, role);
      if (role === 'doctor') {
        await availabilityDao.createDefaultForDoctor(usuario.id);
      }
    }

    return {
      id: usuario.id,
      name: usuario.nombreCompleto,
      email: usuario.email,
      phone: usuario.telefono,
      status: usuario.activo ? 'active' : 'suspended',
      role,
    };
  },

  async deleteUser(id) {
    const usuario = await adminUserDao.softDeleteUser(id);
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};

module.exports = adminUserService;
