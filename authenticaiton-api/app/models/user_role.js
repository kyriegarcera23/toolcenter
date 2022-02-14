'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {foreignKey: 'user_id'});
        this.belongsTo(models.Role, {foreignKey: 'role_id'});
    }
  };
  UserRole.init({
    user_id: DataTypes.BIGINT,
    role_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'UserRole',
  });

  return UserRole;
};