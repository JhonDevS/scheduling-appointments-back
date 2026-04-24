const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class ExcepcionesHorario extends Model {}

  ExcepcionesHorario.init(
    {
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
      es_laborable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'es_laborable',
      },
      motivo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tipo_excepcion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'tipo_excepcion',
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'hora_inicio',
      },
      hora_fin: {
        type: DataTypes.TIME,
        allowNull: true,
        field: 'hora_fin',
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
      modelName: 'ExcepcionesHorario',
      tableName: 'excepciones_horario',
      underscored: true,
    }
  );

  return ExcepcionesHorario;
};
