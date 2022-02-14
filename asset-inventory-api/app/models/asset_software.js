'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetSoftware extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Client, {foreignKey: 'client_id'});
    }
  };
  AssetSoftware.init({
    client_id: DataTypes.BIGINT,
    sr_ticket: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    quantity: DataTypes.BIGINT,
    allocation: DataTypes.STRING,
    warranty_date: DataTypes.STRING,
    warranty: DataTypes.STRING,
    warranty_type: DataTypes.STRING,
    created_by: DataTypes.BIGINT,
    priority: DataTypes.BIGINT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AssetSoftware',
  });
  return AssetSoftware;
};