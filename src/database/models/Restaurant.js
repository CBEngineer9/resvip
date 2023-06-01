'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Table, {foreignKey: 'restaurant_id'});
      this.hasMany(models.Cuisine, {foreignKey: 'restaurant_id'});
      this.hasMany(models.Slot, {foreignKey: 'restaurant_id'});
    }
  }
  Restaurant.init({
    restaurant_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurant_username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    restaurant_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_cuisine: {
      type: DataTypes.ENUM("INDONESIAN","ASIAN","WESTERN"),
      allowNull: false,
    },
    restaurant_contact_person: {
      type: DataTypes.STRING,
    },
    restaurant_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_lat: {
      type: DataTypes.NUMBER,
    },
    restaurant_lng: {
      type: DataTypes.NUMBER,
    },
    restaurant_down_payment: {
      type: DataTypes.NUMBER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    underscored: true,
  });
  return Restaurant;
};