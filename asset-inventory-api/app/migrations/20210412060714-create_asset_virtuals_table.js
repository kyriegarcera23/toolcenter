'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetVirtuals', {
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
      operating_system: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vcpu: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vsockets: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vcores: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vrams_mb: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vrams: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vdisk: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vnetwork: {
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
    await queryInterface.dropTable('AssetVirtuals');
  }
};