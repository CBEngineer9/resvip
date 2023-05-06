const Sequelize = require('sequelize');
const config = require('./db.config')

const {
    host,
    port,
    username,
    password,
    database,
    dialect,
} = config.development

const db = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: dialect
})

console.log('db connected')

module.exports = {
    initDB: () => {
        return db.authenticate();
    },
    getDB: () => {
        return db;
    },
};