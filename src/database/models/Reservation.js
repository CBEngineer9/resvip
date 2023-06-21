'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Seeker, {foreignKey: 'seeker_id'});
      this.belongsTo(models.Table, {foreignKey: 'table_id'});
      this.belongsTo(models.Slot, {foreignKey: 'slot_id'});
    }
  }
  Reservation.init({
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    seeker_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reservation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reservation_status: {
      type: DataTypes.ENUM("WAITING_APPROVAL","APPROVED",'REJECTED')
    },
    paid_down_payment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    payment_order_id: {
      type: DataTypes.STRING,
      defaultValue: null,
    }
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    paranoid: true,
    underscored: true,
  });
  return Reservation;
};