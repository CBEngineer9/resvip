'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reservation, {foreignKey: 'slot_id'});
      this.belongsTo(models.Restaurant, {foreignKey: 'restaurant_id'});
    }
  }
  Slot.init({
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot_day: {
      type: DataTypes.ENUM("SUNDAY","MONDAY",'TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Slot',
    paranoid: true,
    underscored: true,
  });
  return Slot;
};