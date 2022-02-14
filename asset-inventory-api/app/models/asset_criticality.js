'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetCriticality extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetCriticality.init({
    asset_id: DataTypes.BIGINT,
    confidentiality: DataTypes.BIGINT,
    integrity: DataTypes.BIGINT,
    availability: DataTypes.BIGINT,
    total: DataTypes.BIGINT,
    weight: DataTypes.BIGINT,
    asset_weight_value: DataTypes.BIGINT,
    category: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'AssetCriticality',
  });
  return AssetCriticality;
};