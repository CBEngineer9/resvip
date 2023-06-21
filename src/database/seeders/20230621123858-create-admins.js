'use strict';

const { Admin } = require('../models')
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await Admin.bulkCreate([
      {
        'admin_username': 'admin1',
        'admin_password': bcrypt.hashSync('123', 10),
      },
      {
        'admin_username': 'admin2',
        'admin_password': bcrypt.hashSync('123', 10),
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
