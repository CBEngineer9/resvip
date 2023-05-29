'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurants', {
      restaurant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      restaurant_username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      restaurant_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      restaurant_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      restaurant_contact_person: {
        type: Sequelize.STRING
      },
      restaurant_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      restaurant_lat: {
        type: Sequelize.FLOAT
      },
      restaurant_lng: {
        type: Sequelize.FLOAT
      },
      restaurant_down_payment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurants');
  }
};