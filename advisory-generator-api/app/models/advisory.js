'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Advisory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.AdvisoryBatch, {foreignKey: 'batch_id'});
      this.belongsTo(models.Location, {foreignKey: 'location_id'});
      this.belongsTo(models.Site, {foreignKey: 'site_id'});
      // this.hasOne(models.AdvisoryBatch, {foreignKey: 'latest_advisory_id'});
    }
  };
  Advisory.init({
    category: DataTypes.STRING,
    type: DataTypes.STRING,
    batch_id: DataTypes.BIGINT,
    header: DataTypes.TEXT('long'),
    location_id: DataTypes.BIGINT,
    site_id: DataTypes.BIGINT,
    areas: DataTypes.TEXT,
    business_impact: DataTypes.TEXT,
    advisory_data: DataTypes.TEXT('long'),
    approved_by: DataTypes.BIGINT,
    approved_at: DataTypes.DATE,
    rejected_by: DataTypes.BIGINT,
    rejected_at: DataTypes.DATE,
    created_by: DataTypes.BIGINT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Advisory',
  });
  return Advisory;
};