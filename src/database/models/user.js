'use strict';
const { getDB } = require("../../configs/db");
const sequelize = getDB();
const {
  Model, DataTypes
} = require('sequelize');

class User extends Model {
  static associate(models) {
    // define association here
  }
}
User.init({
  user_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
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
    allowNull: true,
  },
  company_lat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company_long: {
    type: DataTypes.STRING,
    allowNull: true
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

module.exports = User;