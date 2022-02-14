'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Site, {foreignKey: 'site_id'});
    }
  };
  Area.init({
    site_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Area',
  });
  return Area;
};