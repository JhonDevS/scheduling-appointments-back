const { DataTypes, Model } = require('sequelize');

module.exports = sequelize => {
  class UsuarioRol extends Model {}

  UsuarioRol.init(
    {
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        field: 'usuario_id',
        primaryKey: true,
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        field: 'rol_id',
        primaryKey: true,
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
      modelName: 'UsuarioRol',
      tableName: 'usuarios_roles',
      underscored: true,
    }
  );

  return UsuarioRol;
};
