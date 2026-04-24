const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class Permiso extends Model {}

  Permiso.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_clave: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nombre_clave',
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      endpoint: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      modelName: 'Permiso',
      tableName: 'permisos',
      underscored: true,
    }
  );

  return Permiso;
};
