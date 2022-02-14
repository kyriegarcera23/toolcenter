'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Role, {foreignKey: 'role_id'});
        this.belongsTo(models.Permission, {foreignKey: 'permission_id'});
    }
  };
  RolePermission.init({
    role_id: DataTypes.BIGINT,
    permission_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'RolePermission',
  });

  return RolePermission;
};