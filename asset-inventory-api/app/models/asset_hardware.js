'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetHardware extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetHardware.init({
    asset_id: DataTypes.BIGINT,
    operating_system: DataTypes.STRING,
    cpu_model: DataTypes.STRING,
    speed: DataTypes.STRING,
    ht_active: DataTypes.STRING,
    number_cpu: DataTypes.STRING,
    cores_per_cpu: DataTypes.STRING,
    number_cores: DataTypes.STRING,
    number_memory: DataTypes.STRING,
    number_nics: DataTypes.STRING,
    number_hbas: DataTypes.STRING,
    number_vms: DataTypes.STRING,
    vrams: DataTypes.STRING,
    hdd: DataTypes.STRING,
    raid_type: DataTypes.STRING,
    power_source_type: DataTypes.STRING,
    connected_on_power_strip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetHardware',
  });
  return AssetHardware;
};