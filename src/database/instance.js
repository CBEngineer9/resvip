const { Sequelize } = require("sequelize");
const env = require("../configs/env.config.js");
const db_config = require("../configs/db.config.js/index.js");

// load configs
const config = db_config[env("NODE_ENV")]

// create sequelize instance
const sequelize = new Sequelize(config.database ,config.username,config.password ?? undefined,{
    host: config.host,
    dialect: config.dialect,
    logging: console.log,
});

module.exports = sequelize;