'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetApplications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      asset_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Assets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      criticality: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ha: {
        allowNull: true,
        type: Sequelize.STRING
      },
      backup: {
        allowNull: true,
        type: Sequelize.STRING
      },
      backup_window: {
        allowNull: true,
        type: Sequelize.STRING
      },
      backup_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      antivirus: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rsa_agent: {
        allowNull: true,
        type: Sequelize.STRING
      },
      syslog: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rc_ip: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rc_username: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rc_password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      service_hosted: {
        allowNull: true,
        type: Sequelize.STRING
      },
      application_running: {
        allowNull: true,
        type: Sequelize.STRING
      },
      server_status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AssetApplications');
  }
};