const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class RolPermiso extends Model {}

  RolPermiso.init(
    {
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        field: 'rol_id',
      },
      permiso_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'permisos', key: 'id' },
        field: 'permiso_id',
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
      modelName: 'RolPermiso',
      tableName: 'roles_permisos',
      underscored: true,
      primaryKey: true,
      autoIncrement: false,
    }
  );

  return RolPermiso;
};
