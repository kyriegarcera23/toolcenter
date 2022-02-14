'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetWarranties', {
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
      warranty: {
        allowNull: true,
        type: Sequelize.STRING
      },
      warranty_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      amc_warranty: {
        allowNull: true,
        type: Sequelize.STRING
      },
      renewal_date: {
        type: Sequelize.STRING
      },
      support_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      support_contact_info: {
        allowNull: true,
        type: Sequelize.STRING
      },
      domain_integration: {
        allowNull: true,
        type: Sequelize.STRING
      },
      pci_guidelines: {
        allowNull: true,
        type: Sequelize.STRING
      },
      remarks: {
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
    await queryInterface.dropTable('AssetWarranties');
  }
};