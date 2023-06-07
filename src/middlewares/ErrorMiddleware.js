const Joi = require("joi/lib/errors");
const { DatabaseError } = require("sequelize");
const jwt = require('jsonwebtoken');
const { MulterError } = require("multer");

function ErrorMiddeware(err, req, res, next) {
    console.error(err.stack);
    if (err instanceof Joi.ValidationError) {
        res.status(419).json({
            message: err.message,
            details: err.details
        });
    } else if (err instanceof DatabaseError) {
        return res.status(500).json({
            message: err
        })
    } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({
            message: err
        })
    } else if (err instanceof MulterError) {
        return res.status(400).json({
            message: err.message
        })
    } else {
        console.log(err);
        res.status(500).json({
            message: 'Something broke!'
        });
    }
}

module.exports = ErrorMiddeware