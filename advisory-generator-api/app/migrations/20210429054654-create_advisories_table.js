'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Advisories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      category: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      batch_id: {
        type: Sequelize.BIGINT
        // references: {
        //   model: 'AdvisoryBatches',
        //   key: 'id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
      },
      header: {
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      location_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      site_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Sites',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      areas: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      business_impact: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      advisory_data: {
        allowNull: true,
        type: Sequelize.TEXT('long')
      },
      approved_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      approved_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      rejected_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      rejected_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      created_by: {
        allowNull: true,
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('Advisories');
  }
};