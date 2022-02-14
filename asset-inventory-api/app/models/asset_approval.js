'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetApproval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Client, {foreignKey: 'client_id'});
    }
  };
  AssetApproval.init({
    client_id: DataTypes.BIGINT,
    asset: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AssetApproval',
  });
  return AssetApproval;
};