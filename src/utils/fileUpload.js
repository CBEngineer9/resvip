const multer = require("multer")
const fs = require("fs")
const path = require("path")

const upload = multer({
    dest: "../uploads",
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        const rules = /jpeg|jpg|png/

        const fileExtension = path.extname(file.originalname).toLowerCase()
        const fileMimeType = file.mimetype

        const cekExt = rules.test(fileExtension)
        const cekMime = rules.test(fileMimeType)

        if (cekExt && cekMime) {
            callback(null, true);
        } 
        else {
            callback(null, false);
            return callback(
                new multer.MulterError(
                    "Tipe file harus .png, .jpg atau .jpeg"
                )
            )
        }
    },
})

module.exports = upload