'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_person_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company_lat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company_long: {
        type: Sequelize.STRING,
        allowNull: true
      },
      down_payment: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "For user restaurant only"
      },
      role: {
        type: Sequelize.ENUM(["A", "T", "R"]),
        allowNull: false,
        comment: "A -> Admin, T -> Travel Agent, R -> Restaurant"
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};