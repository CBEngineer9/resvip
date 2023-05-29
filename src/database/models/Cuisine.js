'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuisine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Restaurant, {foreignKey: 'restaurant_id'});
    }
  }
  Cuisine.init({
    cuisine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    cuisine_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuisine_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: null
    }
  }, {
    sequelize,
    modelName: 'Cuisine',
    tableName: "cuisines",
    underscored: true,
  });
  return Cuisine;
};