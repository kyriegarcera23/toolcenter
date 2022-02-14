'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssetHardwares', {
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
      cpu_model: {
        allowNull: true,
        type: Sequelize.STRING
      },
      speed: {
        allowNull: true,
        type: Sequelize.STRING
      },
      ht_active: {
        allowNull: true,
        type: Sequelize.STRING
      },
      number_cpu: {
        allowNull: true,
        type: Sequelize.STRING
      },
      cores_per_cpu: {
        allowNull: true,
        type: Sequelize.STRING
      },
      number_cores: {
        allowNull: true,
        type: Sequelize.STRING
      },
      number_memory: {
        allowNull: true,
        type: Sequelize.STRING
      },
      number_nics: {
        allowNull: true,
        type: Sequelize.STRING
      },
      number_hbas: {
        allowNull: true,
        type: Sequelize.STRING
      },
      number_vms: {
        allowNull: true,
        type: Sequelize.STRING
      },
      vrams: {
        allowNull: true,
        type: Sequelize.STRING
      },
      hdd: {
        allowNull: true,
        type: Sequelize.STRING
      },
      raid_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      power_source_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      connected_on_power_strip: {
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
    await queryInterface.dropTable('AssetHardwares');
  }
};