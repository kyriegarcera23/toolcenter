'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetNetwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetNetwork.init({
    asset_id: DataTypes.BIGINT,
    dns_servers: DataTypes.STRING,
    dhcp: DataTypes.STRING,
    domain: DataTypes.STRING,
    ntp_server: DataTypes.STRING,
    default_gateway: DataTypes.STRING,
    network_adaptor_address: DataTypes.STRING,
    network_speed: DataTypes.STRING,
    mac_address: DataTypes.STRING,
    network_switch_ip: DataTypes.STRING,
    fibre_slot_port: DataTypes.STRING,
    network_port: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetNetwork',
  });
  return AssetNetwork;
};