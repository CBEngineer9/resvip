'use strict';

const { Restaurant } = require('../models')
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

    await Restaurant.bulkCreate([
      {
        'restaurant_username': 'cafel204',
        'restaurant_password': bcrypt.hashSync('123', 10),
        'restaurant_name': 'Cafe L-204',
        'restaurant_cuisine': 'WESTERN',
        'restaurant_contact_person': 'Mikhael',
        'restaurant_address': 'Jl. Ngagel Jaya Tengah No.73-77',
        'restaurant_lat': -7.290305643419802,
        'restaurant_lng': 112.759000661367,
        'restaurant_down_payment': 50000,
      },
      {
        'restaurant_username': 'carnis',
        'restaurant_password': bcrypt.hashSync('123', 10),
        'restaurant_name': 'CARNIS',
        'restaurant_cuisine': 'WESTERN',
        'restaurant_contact_person': 'Anna',
        'restaurant_address': 'Jl. Raya Gubeng No.96',
        'restaurant_lat': -7.274665707582572,
        'restaurant_lng':  112.74626323072933,
        'restaurant_down_payment': 100000,
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
