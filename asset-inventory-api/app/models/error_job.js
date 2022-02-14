'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ErrorJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  ErrorJob.init({
    metadata: DataTypes.TEXT,
    error: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ErrorJob',
  });
  return ErrorJob;
};