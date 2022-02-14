'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.UserRole, {foreignKey: 'user_id'});
      this.hasMany(models.UserPermission, {foreignKey: 'user_id'});
      this.hasMany(models.UserClient, {foreignKey: 'user_id'});
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    email_verify_at: DataTypes.DATE,
    password: DataTypes.TEXT,
    login_count: DataTypes.INTEGER,
    remember_token:  DataTypes.TEXT,
    api_token:  DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};