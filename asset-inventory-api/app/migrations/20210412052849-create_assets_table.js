'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      sr_ticket: {
        allowNull: true,
        type: Sequelize.STRING
      },
      hostname: {
        allowNull: true,
        type: Sequelize.STRING
      },
      client_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      ip_address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      group: {
        allowNull: true,
        type: Sequelize.STRING
      },
      manufacturer: {
        allowNull: true,
        type: Sequelize.STRING
      },
      model: {
        allowNull: true,
        type: Sequelize.STRING
      },
      service_tag: {
        allowNull: true,
        type: Sequelize.STRING
      },
      hardware_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vendor: {
        allowNull: true,
        type: Sequelize.STRING
      },
      role: {
        allowNull: true,
        type: Sequelize.STRING
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING
      },
      datacenter: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rack_slot: {
        allowNull: true,
        type: Sequelize.STRING
      },
      asset_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      created_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      priority: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Assets');
  }
};