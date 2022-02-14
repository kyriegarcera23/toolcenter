'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {foreignKey: 'user_id'});
        this.belongsTo(models.Permission, {foreignKey: 'permission_id'});
    }
  };
  UserPermission.init({
    user_id: DataTypes.BIGINT,
    permission_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'UserPermission',
  });

  return UserPermission;
};