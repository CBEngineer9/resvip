'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Seeker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reservation, {foreignKey: "seeker_id"});
    }
  }
  Seeker.init({
    seeker_id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    seeker_username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    seeker_password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Seeker',
    tableName: "seekers",
    timestamps: true,
    underscored: true,
  });
  return Seeker;
};