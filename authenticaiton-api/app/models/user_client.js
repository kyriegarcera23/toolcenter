'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserClient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.User, {foreignKey: 'user_id'});
    }
  };
  UserClient.init({
    user_id: DataTypes.BIGINT,
    client_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'UserClient',
  });

  return UserClient;
};