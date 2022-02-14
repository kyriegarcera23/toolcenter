'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Asset, {foreignKey: 'client_id'});
      this.hasMany(models.AssetSoftware, {foreignKey: 'client_id'});
      this.hasMany(models.Recipient, {foreignKey: 'client_id'});
      this.hasMany(models.AssetApproval, {foreignKey: 'client_id'});
    }
  };
  Client.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.INTEGER,    
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};