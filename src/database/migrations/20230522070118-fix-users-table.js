'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users','user_id',{
      type: Sequelize.INTEGER,
      autoIncrement: true
    });
    await queryInterface.changeColumn('users','created_at',{
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    })
    await queryInterface.changeColumn('users','updated_at',{
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users','user_id',{
      type: Sequelize.STRING,
      autoIncrement: false
    });
    await queryInterface.changeColumn('users','created_at',{
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NULL")
    })
    await queryInterface.changeColumn('users','updated_at',{
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("NULL")
    });
  }
};
