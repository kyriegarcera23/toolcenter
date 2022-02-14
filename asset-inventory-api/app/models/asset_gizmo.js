'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetGizmo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  AssetGizmo.init({
    vendor: DataTypes.TEXT,
    model_number: DataTypes.TEXT,
    description: DataTypes.TEXT,
    serial_number: DataTypes.TEXT,
    warranty_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AssetGizmo',
  });
  return AssetGizmo;
};