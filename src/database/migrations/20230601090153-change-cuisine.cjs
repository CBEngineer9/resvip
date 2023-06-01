'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('restaurants','restaurant_cuisine',{
      type: Sequelize.ENUM("INDONESIAN","ASIAN","WESTERN"),
      allowNull: false,
      after: "restaurant_name"
    });
    await queryInterface.dropTable('cuisines');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("restaurants",'restaurant_cuisine')
    await queryInterface.createTable('cuisines', {
      cuisine_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cuisine_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cuisine_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "restaurants",
          },
          key: 'restaurant_id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  }
};
