const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class Cita extends Model {}

  Cita.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        field: 'paciente_id',
      },
      medico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        field: 'medico_id',
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'hora_inicio',
      },
      hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
        field: 'hora_fin',
      },
      estado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'estados_cita', key: 'id' },
        field: 'estado_id',
      },
      notas_medicas: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'notas_medicas',
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      eliminado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'Cita',
      tableName: 'citas',
      underscored: true,
    }
  );

  return Cita;
};
