const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { User } = require('../database/models')
const Joi = require('joi')
const HereAPIService = require('../services/HereAPIService')
const addressValid = require('../validations/addressValid')

const { upload } = require('../utils/fileUpload')
const fs = require('fs')
const path = require('path')

const register = async (req,res) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required().messages({
            "string.min": "Username minimal 6 karakter",
            "any.required": "Username harus diisi",
            "string.empty": "Username harus diisi",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Email tidak valid",
            "any.required": "Email harus diisi",
            "string.empty": "Email harus diisi",
        }),
        password: Joi.string().min(8).required().messages({
            "string.min": "Password minimal 8 karakter",
            "any.required": "Password harus diisi",
            "string.empty": "Password harus diisi",
        }),
        confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
            "any.only": "Konfirmasi password tidak sesuai",
            "any.required": "Password harus diisi",
            "string.empty": "Password harus diisi",
        }),
        contact_person_name: Joi.string().required().messages({
            "any.required": "Nama Contact Person harus diisi",
            "string.empty": "Nama Contact Person harus diisi",
        }),
        company_name: Joi.string().required().messages({
            "any.required": "Nama Perusahaan harus diisi",
            "string.empty": "Nama Perusahaan harus diisi",
        }),
        company_address: Joi.string().external(addressValid).required().messages({
            "any.required": "Alamat Perusahaan harus diisi",
            "string.empty": "Alamat Perusahaan harus diisi",
        }),
        // company_lat: Joi.number().optional().messages({
        //     "any.required": "Latitude Perusahaan harus diisi",
        //     "string.empty": "Latitude Perusahaan harus diisi",
        // }),
        // company_long: Joi.number().optional().messages({
        //     "any.required": "Longitude Perusahaan harus diisi",
        //     "string.empty": "Longitude Perusahaan harus diisi",
        // }),
        role: Joi.string().valid('A', 'T', 'R').required().messages({
            "any.required": "Role harus diisi",
            "string.empty": "Role harus diisi",
            "any.valid": "Role hanya bisa A, T, atau R"
        })
    })
    try{
        const validated = await schema.validateAsync(req.body,{
            convert: true
        })
        // console.log(validated.company_address);
    }
    catch(validationErr){
        return res.status(400).send(validationErr)
    }

    const { username, email, password, confirm_password, contact_person_name, company_name, company_address, role } = req.body

    // get correct coord
    const coords = await HereAPIService.getCoords(company_address)

    const newUser = await User.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 12),
        contact_person_name: contact_person_name,
        company_name: company_name,
        company_address: coords.address,
        company_lat: coords.pos.lat,
        company_long: coords.pos.lng,
        role: role
    })

    const uploadFile = upload.single('ktp')
    uploadFile(req, res, function(err){
        if(err){
            return res.status(400).send({...err, msg:err.message})
        }
    
        const newFilename = `${req.body.username}${path.extname(req.file.originalname).toLowerCase()}`
        fs.renameSync(`../uploads/${req.file.filename}`, `../uploads/ktp/${newFilename}`)
    
        return res.status(200).send({
            message: "Register berhasil",
            user: newUser,
            ktp: `../uploads/ktp/${newFilename}`
        })
    })
}

const login = async (req, res) => {
    const { username, email, password } = req.body

    if(!username && !email){
        return res.status(400).send({
            message: "Username atau Email harus diisi"
        })
    }

    const schema = Joi.object({
        username: Joi.string().messages({

        }),
        email: Joi.string().email().messages({
            "string.email": "Email tidak valid",
        }),
        password: Joi.string().required().messages({
            "any.required": "Password harus diisi",
            "string.empty": "Password harus diisi",
        })
    })
    try{
        await schema.validateAsync(req.body)
    }
    catch(validationErr){
        return res.status(400).send(validationErr)
    }

    const user = await User.findOne({
        where:{
            [Op.or]: [
                {username: username},
                {email: email}
            ]
        }
    })

    if(!user){
        return res.status(404).send({
            message:{
                email: "Username/Email tidak terdaftar"
            }
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).send({
            message: "Password salah"
        })
    }

    const token = jwt.sign({
        id: user.user_id,
        email: user.email,
        username: user.username,
        name: user.company_name,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    return res.status(200).send({
        message: "Login berhasil",
        user: {
            id: user.user_id,
            email: user.email,
            username: user.username,
            name: user.company_name,
            role: user.role
        },
        token: token
    })
}

module.exports = {
    register, login
}