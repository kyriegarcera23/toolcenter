'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetWarranty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetWarranty.init({
    asset_id: DataTypes.BIGINT,
    warranty: DataTypes.STRING,
    warranty_type: DataTypes.STRING,
    amc_warranty: DataTypes.STRING,
    renewal_date: DataTypes.STRING,
    support_type: DataTypes.STRING,
    support_contact_info: DataTypes.STRING,
    domain_integration: DataTypes.STRING,
    pci_guidelines: DataTypes.STRING,
    remarks: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetWarranty',
  });
  return AssetWarranty;
};