'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmailQueues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      email_recipients: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      email_subject: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      email_text: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      email_html: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      email_data: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      email_attach: {
        allowNull: true,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('EmailQueues');
  }
};