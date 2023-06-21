const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const { Admin, Seeker, Restaurant } = require('../database/models')
const HereAPIService = require('../services/HereAPIService')
const addressValid = require('../validations/addressValid')
const fileSchema = require('../validations/fileValid')

const upload  = require('../utils/fileUpload')
const fs = require('fs')
const path = require('path')
const ExpressController = require('./_ExpressController')
const NotFoundError = require('../errors/NotFoundError')
const env = require('../configs/env.config')

class AuthController extends ExpressController {
    
    uploadKTP(req,res,next){
        const uploadFile = upload.single('ktp')
        uploadFile(req, res, function(err){
            if(err){
                // throw new Error(err.message);
                next(err);
                // return
                // return new Error(err.message)
                // return res.status(400).send({...err, msg:err.message})
            }
            next();
        })
    }

    async register(req,res, next) {
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
            cuisine: Joi.string().valid('Indonesian', 'Asian', 'Western').optional().messages({

            }),
            down_payment: Joi.number().optional().messages({

            }),
            role: Joi.string().valid('Admin', 'Seeker', 'Restaurant').required().messages({
                "any.required": "Role harus diisi",
                "string.empty": "Role harus diisi",
                "any.valid": "Role hanya bisa Admin, Seeker, atau Restaurant"
            }),
            // ktp: Joi.external(fileSchema).messages({
            //     "any.required": "Mohon upload foto KTP",
            // })
        })

        await schema.validateAsync(req.body,{
            convert: true
        })

        // check file uploaded
        if (!req.file) {
            throw new Joi.ValidationError("Mohon upload foto KTP", [{
                message: "Mohon upload foto KTP",
                path: ["ktp"],
                type: "custom"
            }])
        }
        
        // make sure folder exist
        if (!fs.existsSync('./storage')) {
            fs.mkdirSync('./storage')
        }
        if (!fs.existsSync('./storage/ktp')) {
            fs.mkdirSync('./storage/ktp')
        }
        // move file
        const newFilename = `${req.body.username}${path.extname(req.file.originalname).toLowerCase()}`
        fs.renameSync(`./uploads/${req.file.filename}`, `./storage/ktp/${newFilename}`)

        const { username, password, contact_person, name, address, down_payment, cuisine, role } = req.body
        if(role == 'Restaurant' && (!name || !contact_person || !address || !down_payment || !cuisine)){
            return res.status(400).send({
                message: "Mohon lengkapi data restoran"
            })
        }

        // get correct coord
        const coords = await HereAPIService.getCoords(address)

        let newUser;
        if(role == 'Admin'){
            newUser = await Admin.create({
                admin_username: username,
                admin_password: await bcrypt.hash(password,10)
            })
        }
        else if(role=='Seeker'){
            newUser = await Seeker.create({
                seeker_username: username,
                seeker_password: await bcrypt.hash(password,10)
            })
        }
        else if(role=='Restaurant'){
            newUser = await Restaurant.create({
                restaurant_username: username,
                restaurant_password: await bcrypt.hash(password,10),
                restaurant_name: name,
                restaurant_contact_person: contact_person,
                restaurant_address: coords.address,
                restaurant_lat: coords.pos.lat,
                restaurant_lng: coords.pos.lng,
                restaurant_cuisine: cuisine,
                restaurant_down_payment: down_payment
            })
        }

        // prevent password to be seen
        delete newUser.password;

        return res.status(201).send({
            message: "Register berhasil",
            user: newUser,
            role: role,
            ktp: `/ktp/${newFilename}`
        })
    }

    async login(req, res) {
        const { username, password } = req.body

        const schema = Joi.object({
            username: Joi.string().required().empty().messages({
                "any.required": "Username harus diisi",
                "string.empty": "Username harus diisi",
            }),
            password: Joi.string().required().empty().messages({
                "any.required": "Password harus diisi",
                "string.empty": "Password harus diisi",
            })
        })

        await schema.validateAsync(req.body)

        let user = null
        let role = null
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
        role = "admin"

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
            role = "seeker"
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
            role = "restaurant"
        }
        if(!user){
            throw new NotFoundError("Username tidak terdaftar", {
                username
            })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.dataValues.password)
        if(!isPasswordValid){
            return res.status(400).send({
                message: "Password salah"
            })
        }

        let payload = {
            id: user.dataValues.id,
            username: user.dataValues.username,
            name: user.dataValues.name ?? null,
            role: role.toLowerCase()
        }
        const token = jwt.sign(payload, env("JWT_KEY"), {
            expiresIn: '1d'
        })

        return res.status(200).send({
            message: "Login berhasil",
            user: payload,
            token: token
        })
    }
}

module.exports = new AuthController()