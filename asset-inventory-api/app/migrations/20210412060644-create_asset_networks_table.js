'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetNetworks', {
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
      dns_servers: {
        allowNull: true,
        type: Sequelize.STRING
      },
      dhcp: {
        allowNull: true,
        type: Sequelize.STRING
      },
      domain: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ntp_server: {
        allowNull: true,
        type: Sequelize.STRING
      },
      default_gateway: {
        allowNull: true,
        type: Sequelize.STRING
      },
      network_adaptor_address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      network_speed: {
        allowNull: true,
        type: Sequelize.STRING
      },
      mac_address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      network_switch_ip: {
        allowNull: true,
        type: Sequelize.STRING
      },
      fibre_slot_port: {
        allowNull: true,
        type: Sequelize.STRING
      },
      network_port: {
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
    await queryInterface.dropTable('AssetNetworks');
  }
};