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
        'reservation_date': '2023-06-23',
        'reservation_status': 'APPROVED',
        'paid_down_payment': 1,
        'payment_order_id': '.yna2'
      },
      {
        'seeker_id': 2,
        'table_id': 3,
        'slot_id': 4,
        'reservation_date': '2023-06-23',
        'reservation_status': 'WAITING_APPROVAL',
        'paid_down_payment': 0,
        'payment_order_id': '.210a'
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
