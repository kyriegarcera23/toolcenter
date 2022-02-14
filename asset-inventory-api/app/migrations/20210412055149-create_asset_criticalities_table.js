'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetCriticalities', {
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
      confidentiality: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      integrity: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      availability: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      total: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      weight: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      asset_weight_value: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      category: {
        allowNull: true,
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('AssetCriticalities');
  }
};