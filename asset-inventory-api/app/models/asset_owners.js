'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetOwner.init({
    asset_id: DataTypes.BIGINT,
    app_owner: DataTypes.STRING,
    app_owner_contact_info: DataTypes.STRING,
    email_id: DataTypes.STRING,
    system_owner: DataTypes.STRING,
    business_owner: DataTypes.STRING,
    business_owner_contact_info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetOwner',
  });
  return AssetOwner;
};