'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetVirtual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetVirtual.init({
    asset_id: DataTypes.BIGINT,
    operating_system: DataTypes.STRING,
    vcpu: DataTypes.STRING,
    vsockets: DataTypes.STRING,
    vcores: DataTypes.STRING,
    vrams_mb: DataTypes.STRING,
    vrams: DataTypes.STRING,
    vdisk: DataTypes.STRING,
    vnetwork: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetVirtual',
  });
  return AssetVirtual;
};