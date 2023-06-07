const multer = require("multer")
const fs = require("fs")
const path = require("path")
const Joi = require("joi")

const upload = multer({
    dest: "./uploads",
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        const rules = /jpeg|jpg|png/

        const fileExtension = path.extname(file.originalname).toLowerCase()
        const fileMimeType = file.mimetype

        const cekExt = rules.test(fileExtension)
        const cekMime = rules.test(fileMimeType)
        
        if (cekExt && cekMime) {
            cb(null, true);
        } 
        else {
            // cb(null, false);
            return cb(
                new Joi.ValidationError(
                    "Tipe file harus .png, .jpg atau .jpeg"
                )
            )
        }
    },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
    }
})

module.exports = upload