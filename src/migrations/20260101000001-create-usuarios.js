const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('usuarios', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      nombre_completo: { type: DataTypes.STRING(255), allowNull: false },
      telefono: { type: DataTypes.STRING(20), allowNull: true },
      fecha_registro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      eliminado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('usuarios');
  },
};
