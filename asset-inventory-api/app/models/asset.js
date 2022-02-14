'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Client, {foreignKey: 'client_id'});
      this.hasOne(models.AssetApplication, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetCriticality, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetHardware, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetMaintenance, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetNetwork, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetOwner, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetVirtual, {foreignKey: 'asset_id'});
      this.hasOne(models.AssetWarranty, {foreignKey: 'asset_id'});
    }
  };
  Asset.init({
    sr_ticket: DataTypes.STRING,
    hostname: DataTypes.STRING,
    client_id: DataTypes.BIGINT,
    ip_address: DataTypes.STRING,
    hostname: DataTypes.STRING,
    group: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    model: DataTypes.STRING,
    service_tag: DataTypes.STRING,
    hardware_type: DataTypes.STRING,
    vendor: DataTypes.STRING,
    role: DataTypes.STRING,
    location: DataTypes.STRING,
    datacenter: DataTypes.STRING,
    rack_slot: DataTypes.STRING,
    asset_type: DataTypes.STRING,
    created_by: DataTypes.BIGINT,
    priority: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Asset',
  });
  return Asset;
};