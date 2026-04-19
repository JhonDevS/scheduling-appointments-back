const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('citas', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'paciente_id',
      },
      medico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'medico_id',
      },
      fecha: { type: DataTypes.DATEONLY, allowNull: false },
      hora_inicio: { type: DataTypes.TIME, allowNull: false, field: 'hora_inicio' },
      hora_fin: { type: DataTypes.TIME, allowNull: false, field: 'hora_fin' },
      estado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'estados_cita', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        field: 'estado_id',
      },
      notas_medicas: { type: DataTypes.TEXT, allowNull: true, field: 'notas_medicas' },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      eliminado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('citas');
  },
};
