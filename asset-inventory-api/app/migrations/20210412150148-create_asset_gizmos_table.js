'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetGizmos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      vendor: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      model_number: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      serial_number: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      warranty_type: {
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
    await queryInterface.dropTable('AssetGizmos');
  }
};