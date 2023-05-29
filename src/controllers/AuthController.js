const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const { Admin, Seeker, Restaurant } = require('../database/models')
const HereAPIService = require('../services/HereAPIService')
const addressValid = require('../validations/addressValid')
const fileSchema = require('../validations/fileValid')

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
        name: Joi.string().optional().messages({

        }),
        contact_person: Joi.string().optional().messages({

        }),
        address: Joi.string().external(addressValid).optional().messages({

        }),
        lat: Joi.number().optional().messages({

        }),
        lng: Joi.number().optional().messages({

        }),
        down_payment: Joi.number().optional().messages({

        }),
        role: Joi.string().valid('Admin', 'Seeker', 'Restaurant').required().messages({
            "any.required": "Role harus diisi",
            "string.empty": "Role harus diisi",
            "any.valid": "Role hanya bisa Admin, Seeker, atau Restaurant"
        }),
        ktp: Joi.external(fileSchema).messages({
            "any.required": "Mohon upload foto KTP",
        })
    })
    try{
        await schema.validateAsync(req.body,{
            convert: true
        })
    }
    catch(validationErr){
        return res.status(400).send(validationErr)
    }

    const { username, password, contact_person, name, address, role } = req.body

    // get correct coord
    const coords = await HereAPIService.getCoords(address)

    let newUser;
    if(role = 'Admin'){
        newUser = await Admin.create({
            admin_username: username,
            admin_password: password
        })
    }
    else if(role=='Seeker'){
        newUser = await Seeker.create({
            seeker_username: username,
            seeker_password: password
        })
    }
    else if(role=='Restaurant'){
        newUser = await Restaurant.create({
            restaurant_username: username,
            restaurant_password: password,
            restaurant_name: name,
            restaurant_contact_person: contact_person,
            restaurant_address: coords.address,
            restaurant_lat: coords.pos.lat,
            restaurant_lng: coords.pos.lng,
            restaurant_down_payment: down_payment
        })
    }

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
        username: Joi.string().required().messages({
            "any.required": "Username harus diisi",
            "string.empty": "Username harus diisi",
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

    let user = null
    user = await Admin.findOne({
        where: {
            admin_username: username
        },
        attributes: [
            ['admin_id', 'id'],
            ['admin_username', 'username'],
            ['admin_password', 'password'],
        ]
    })
    if(!user){
        user = await Seeker.findOne({
            where: {
                seeker_username: username
            },
            attributes: [
                ['seeker_id', 'id'],
                ['seeker_username', 'username'],
                ['seeker_password', 'password'],
            ]
        })
    }
    if(!user){
        user = await Restaurant.findOne({
            where: {
                restaurant_username: username
            },
            attributes: [
                ['restaurant_id', 'id'],
                ['restaurant_username', 'username'],
                ['restaurant_password', 'password'],
                ['restaurant_name', 'name'],
            ]
        })
    }
    if(!user){
        return res.status(404).send({
            message:{
                email: "Username tidak terdaftar"
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
        id: user.id,
        username: user.username,
        name: user.name ? user.name : null,
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