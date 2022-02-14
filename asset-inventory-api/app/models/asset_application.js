'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Asset, {foreignKey: 'asset_id'});
    }
  };
  AssetApplication.init({
    asset_id: DataTypes.BIGINT,
    criticality: DataTypes.STRING,
    ha: DataTypes.STRING,
    backup: DataTypes.STRING,
    backup_window: DataTypes.STRING,
    backup_type: DataTypes.STRING,
    antivirus: DataTypes.STRING,
    rsa_agent: DataTypes.STRING,
    syslog: DataTypes.STRING,
    rc_ip: DataTypes.STRING,
    rc_username: DataTypes.STRING,
    rc_password: DataTypes.STRING,
    service_hosted: DataTypes.STRING,
    application_running: DataTypes.STRING,
    server_status: DataTypes.STRING    
  }, {
    sequelize,
    modelName: 'AssetApplication',
  });
  return AssetApplication;
};