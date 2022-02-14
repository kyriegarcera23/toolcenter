'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Client, {foreignKey: 'client_id'});
    }
  };
  Recipient.init({
    client_id: DataTypes.BIGINT,
    created_by: DataTypes.BIGINT,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Recipient',
  });
  return Recipient;
};