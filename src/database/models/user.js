'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    user_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_person_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_lat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_long: {
      type: DataTypes.STRING,
      allowNull: false
    },
    down_payment: {
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.ENUM(["A", "T", "R"]),
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: "Users",
    underscored: true,
    timestamps: true,
  });
  return User;
};