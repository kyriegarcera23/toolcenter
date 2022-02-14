'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AdvisoryBatches', {
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
      category: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_completed: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      latest_advisory_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'Advisories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      started_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      completed_at: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('AdvisoryBatches');
  }
};