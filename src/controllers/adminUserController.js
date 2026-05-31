const adminUserService = require('../services/adminUserService');
const response = require('../utils/response');

const adminUserController = {
  async list(req, res, _) {
    try {
      const users = await adminUserService.listUsers();
      return response.success(res, 200, 'Usuarios obtenidos correctamente', users);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async create(req, res, _) {
    try {
      const user = await adminUserService.createUser(req.body);
      return response.success(res, 201, 'Usuario creado correctamente', user);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async update(req, res, _) {
    try {
      const { id } = req.params;
      const user = await adminUserService.updateUser(id, req.body);
      return response.success(res, 200, 'Usuario actualizado correctamente', user);
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },

  async remove(req, res, _) {
    try {
      const { id } = req.params;
      await adminUserService.deleteUser(id);
      return response.success(res, 200, 'Usuario eliminado correctamente');
    } catch (error) {
      return response.error(res, error.statusCode || 500, error.message);
    }
  },
};

module.exports = adminUserController;
