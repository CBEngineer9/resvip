'use strict';

const { Slot } = require('../models')

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

    await Slot.bulkCreate([
      {
        'restaurant_id': 1,
        'slot_day': 5,
        'start_time': '10:00',
        'end_time': '12:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 5,
        'start_time': '12:00',
        'end_time': '14:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 5,
        'start_time': '14:00',
        'end_time': '16:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 5,
        'start_time': '16:00',
        'end_time': '18:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 6,
        'start_time': '10:00',
        'end_time': '12:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 6,
        'start_time': '12:00',
        'end_time': '14:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 6,
        'start_time': '14:00',
        'end_time': '16:00',
      },
      {
        'restaurant_id': 1,
        'slot_day': 6,
        'start_time': '16:00',
        'end_time': '18:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 5,
        'start_time': '10:00',
        'end_time': '12:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 5,
        'start_time': '12:00',
        'end_time': '14:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 5,
        'start_time': '14:00',
        'end_time': '16:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 5,
        'start_time': '16:00',
        'end_time': '18:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 6,
        'start_time': '10:00',
        'end_time': '12:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 6,
        'start_time': '12:00',
        'end_time': '14:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 6,
        'start_time': '14:00',
        'end_time': '16:00',
      },
      {
        'restaurant_id': 2,
        'slot_day': 6,
        'start_time': '16:00',
        'end_time': '18:00',
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
