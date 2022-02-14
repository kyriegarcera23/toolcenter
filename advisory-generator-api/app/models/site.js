'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Site extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Location, {foreignKey: 'location_id'});
      this.hasMany(models.Area, {foreignKey: 'site_id'});
      this.hasMany(models.Advisory, {foreignKey: 'site_id'});
    }
  };
  Site.init({
    location_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Site',
  });
  return Site;
};