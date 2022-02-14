'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('AssetApprovals', 'client_id',{
      type: Sequelize.BIGINT,
      after: "id",
      references: {
        model: 'Clients',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('AssetApprovals', 'client_id');
  }
};