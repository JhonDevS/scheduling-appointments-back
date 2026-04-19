const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('horarios_base', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      medico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'medico_id',
      },
      dia_semana: { type: DataTypes.INTEGER, allowNull: false, field: 'dia_semana' },
      hora_inicio: { type: DataTypes.TIME, allowNull: false, field: 'hora_inicio' },
      hora_fin: { type: DataTypes.TIME, allowNull: false, field: 'hora_fin' },
      duracion_minutos: { type: DataTypes.INTEGER, allowNull: false, field: 'duracion_minutos' },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('horarios_base');
  },
};
