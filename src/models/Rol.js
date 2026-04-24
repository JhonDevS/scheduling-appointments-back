const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class Rol extends Model {}

  Rol.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      descripcion: {
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
      modelName: 'Rol',
      tableName: 'roles',
      underscored: true,
    }
  );

  return Rol;
};
