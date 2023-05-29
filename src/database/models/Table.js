'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reservation, {foreignKey: 'table_id'});
      this.belongsTo(models.Restaurant, {foreignKey: 'restaurant_id'});
    }
  }
  Table.init({
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    table_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    table_status: {
      type: DataTypes.ENUM("AVAILABLE",'BOOKED'),
      allowNull: false,
      defaultValue: "AVAILABLE"
    }
  }, {
    sequelize,
    modelName: 'Table',
    tableName: "tables",
    underscored: true,
  });
  return Table;
};