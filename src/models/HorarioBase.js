const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class HorarioBase extends Model {}

  HorarioBase.init(
    {
      medico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        field: 'medico_id',
      },
      dia_semana: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'dia_semana',
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
      duracion_minutos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'duracion_minutos',
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      modelName: 'HorarioBase',
      tableName: 'horarios_base',
      underscored: true,
    }
  );

  return HorarioBase;
};
