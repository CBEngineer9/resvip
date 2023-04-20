const env = require("./env.config.js");

const db_config = {
  "development": {
    "username": env('DB_USER', "root"),
    "password": env('DB_PASS', ""),
    "database": env('DB_DATABASE', "vetpicurean_web"),
    "host": env("DB_HOST", "localhost"),
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

module.exports = db_config
