'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Advisories', 'batch_id', {
      type: Sequelize.BIGINT,
      references: {
        model: 'AdvisoryBatches',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Advisories', 'batch_id', {
      type: Sequelize.BIGINT
    });
  }
};