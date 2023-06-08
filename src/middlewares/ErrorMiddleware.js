const Joi = require("joi/lib/errors");
const { DatabaseError } = require("sequelize");
const jwt = require('jsonwebtoken');
const { MulterError } = require("multer");
const { default: ResponseError } = require("../errors/ResponseError");

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
    } else if (err instanceof ResponseError) {
        // include all custom error
        return res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message
        })
    }  else {
        console.log(err);
        res.status(500).json({
            code: 500,
            message: 'Unknown Error Occured!'
        });
    }
}

module.exports = ErrorMiddeware