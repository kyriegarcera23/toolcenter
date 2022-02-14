'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetOwners', {
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
      app_owner: {
        allowNull: true,
        type: Sequelize.STRING
      },
      app_owner_contact_info: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      system_owner: {
        allowNull: true,
        type: Sequelize.STRING
      },
      business_owner: {
        allowNull: true,
        type: Sequelize.STRING
      },
      business_owner_contact_info: {
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
    await queryInterface.dropTable('AssetOwners');
  }
};