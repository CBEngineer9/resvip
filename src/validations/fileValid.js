const Joi = require('joi')

const fileSchema = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
    size: Joi.number().max(5 * 1024 * 1024).required() // Maximum file size of 5MB
})

module.exports = fileSchema