const process = require('node:process');
const dotenv = require('dotenv') // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const envs= {
    NODE_ENV: process.env.NODE_ENV ?? "production",

    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,

    LOG_LEVEL: (process.env.LOG_LEVEL)?.toUpperCase() ?? "NOTICE",
    LOG_FORMAT: process.env.LOG_FORMAT ?? "common", // common | JSON
    JWT_KEY: process.env.JWT_KEY,
}


/**
 * returns value of env defined in .env or default value defined in env.config.ts
 * @param {keyof typeof envs} key 
 * @param {string | number | boolean} default_value
 * @returns value of env
 */
function env(key, default_value) {
    return envs[key] ?? default_value
}

module.exports = env;