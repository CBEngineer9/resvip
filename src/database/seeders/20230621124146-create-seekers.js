'use strict';

const { Seeker } = require('../models')
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

    await Seeker.bulkCreate([
      {
        'seeker_username': 'kevin',
        'seeker_password': bcrypt.hashSync('123', 10),
      },
      {
        'seeker_username': 'acxel',
        'seeker_password': bcrypt.hashSync('123', 10),
      },
      {
        'seeker_username': 'cherilyn',
        'seeker_password': bcrypt.hashSync('123', 10),
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
