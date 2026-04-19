const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.createTable('excepciones_horario', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      medico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'medico_id',
      },
      fecha: { type: DataTypes.DATEONLY, allowNull: false },
      es_laborable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'es_laborable',
      },
      motivo: { type: DataTypes.TEXT, allowNull: true },
      tipo_excepcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'tipo_excepcion',
      },
      hora_inicio: { type: DataTypes.TIME, allowNull: true, field: 'hora_inicio' },
      hora_fin: { type: DataTypes.TIME, allowNull: true, field: 'hora_fin' },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down({ context: queryInterface }) {
    await queryInterface.dropTable('excepciones_horario');
  },
};
