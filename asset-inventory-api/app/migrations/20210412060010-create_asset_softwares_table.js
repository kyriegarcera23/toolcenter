'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetSoftwares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
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
      sr_ticket: {
        allowNull: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      quantity: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      allocation: {
        allowNull: true,
        type: Sequelize.STRING
      },
      warranty_date: {
        allowNull: true,
        type: Sequelize.STRING
      },
      warranty: {
        allowNull: true,
        type: Sequelize.STRING
      },
      warranty_type: {
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
    await queryInterface.dropTable('AssetSoftwares');
  }
};