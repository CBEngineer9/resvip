'use strict';

const { Reservation } = require('../models')

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

    await Reservation.bulkCreate([
      {
        'seeker_id': 1,
        'table_id': 1,
        'slot_id': 2,
        'reservation_date': '2023-06-24',
        'reservation_status': 'APPROVED',
        'paid_down_payment': 1,
      },
      {
        'seeker_id': 2,
        'table_id': 3,
        'slot_id': 4,
        'reservation_date': '2023-06-24',
        'reservation_status': 'WAITING_APPROVAL',
        'paid_down_payment': 0,
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
