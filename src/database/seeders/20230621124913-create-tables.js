'use strict';

const { Table } = require('../models')

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

    await Table.bulkCreate([
      {
        'restaurant_id': 1,
        'table_number': 1,
      },
      {
        'restaurant_id': 1,
        'table_number': 2,
      },
      {
        'restaurant_id': 1,
        'table_number': 3,
      },
      {
        'restaurant_id': 1,
        'table_number': 4,
      },
      {
        'restaurant_id': 1,
        'table_number': 5,
      },
      {
        'restaurant_id': 2,
        'table_number': 1,
      },
      {
        'restaurant_id': 2,
        'table_number': 2,
      },
      {
        'restaurant_id': 2,
        'table_number': 3,
      },
      {
        'restaurant_id': 2,
        'table_number': 4,
      },
      {
        'restaurant_id': 2,
        'table_number': 5,
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
