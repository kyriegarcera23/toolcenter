'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailQueue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  EmailQueue.init({
    email_recipients: DataTypes.TEXT,
    email_subject: DataTypes.TEXT,
    email_text: DataTypes.TEXT,
    email_html: DataTypes.TEXT,
    email_data: DataTypes.TEXT,
    email_attach: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmailQueue',
  });
  return EmailQueue;
};