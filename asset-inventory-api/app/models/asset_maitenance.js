'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetMaintenance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetMaintenance.init({
    asset_id: DataTypes.BIGINT,
    frequency: DataTypes.STRING,
    procedure: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetMaintenance',
  });
  return AssetMaintenance;
};