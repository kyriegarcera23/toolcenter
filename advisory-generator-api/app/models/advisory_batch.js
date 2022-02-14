'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdvisoryBatch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Advisory, {foreignKey: 'batch_id'});
      this.belongsTo(models.Client, {foreignKey: 'client_id'});
      // this.belongsTo(models.Advisory, {foreignKey: 'latest_advisory_id'});
    }
  };
  AdvisoryBatch.init({
    client_id: DataTypes.BIGINT,
    category: DataTypes.STRING,
    is_completed: DataTypes.INTEGER,
    latest_advisory_id: DataTypes.BIGINT,
    created_by: DataTypes.BIGINT,
    started_at: DataTypes.DATE,
    completed_at: DataTypes.DATE,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AdvisoryBatch',
  });
  return AdvisoryBatch;
};