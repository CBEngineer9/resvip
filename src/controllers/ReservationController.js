const Joi = require('joi')
const moment = require('moment')
const { Reservation, Table, Restaurant } = require('../database/models')

const addReservasi = async (req,res) => {
    const schema = Joi.object({
        table_id: Joi.number().required().messages({
            "any.required": "ID table harus diisi",
            "number.base": "ID table harus berupa angka"
        }),
        reservation_date: Joi.date().required().messages({
            "any.required": "Tanggal reservasi harus diisi",
            "date.base": "Tanggal reservasi harus berupa tanggal"
        })
    })
    try{
        await schema.validateAsync(req.body,{
            convert: true
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    const { table_id, reservation_date } = req.body

    const reservation = await Reservation.create({
        seeker_id: req.user.id,
        table_id: table_id,
        reservation_date: reservation_date,
        reservation_status: 'WAITING_APPROVAL'
    })
    return res.status(201).json({
        message: "Reservasi berhasil dibuat",
        data: reservation
    })
}

const rescheduleReservasi = async (req,res) => {
    const schema = Joi.object({
        reservation_id: Joi.number().required().messages({
            "any.required": "ID reservasi harus diisi",
            "number.base": "ID reservasi harus berupa angka"
        }),
        reservation_date: Joi.date().required().messages({
            "any.required": "Tanggal reschedule harus diisi",
            "date.base": "Tanggal reschedule harus berupa tanggal"
        })
    })
    try{
        await schema.validateAsync(req.body,{
            convert: true
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    const { reservation_id, reservation_date } = req.body
    const reservation = await Reservation.findByPk(reservation_id)

    if(!reservation){
        return res.status(404).send({
            message: 'Reservasi tidak ditemukan'
        })
    }
    if(reservation.seeker_id != req.user.id){
        return res.status(403).send({
            message: 'Anda bukan pemilik reservasi ini'
        })
    }

    await reservation.update({
        reservation_date: reservation_date
    })

    return res.status(200).send({
        message: "Reservasi berhasil di-reschedule",
    })
}

const getAllReservasi = async (req,res) => {
    let { start_date, end_date } = req.query
    const reservations = await Reservation.findAll({
        where: {
            seeker_id: req.user.id
        },
        attributes: [
            ['reservation_id', 'id'],
            ['reservation_date', 'date'],
            ['reservation_status', 'status'],
        ],
        include: [
            {
                model: Table,
                attributes: [
                    ['table_name', 'table_name'],
                    ['table_capacity', 'table_capacity'],
                ]
            },
            {
                model: Restaurant,
                attributes: [
                    ['restaurant_name', 'restaurant_name'],
                    ['restaurant_address', 'restaurant_address']
                ]
            }
        ]
    })

    const ret = []
    reservations.forEach(reservation => {
        if(start_date){
            if(moment(reservation.date).isBefore(start_date)){
                return
            }
        }
        if(end_date){
            if(moment(reservation.date).isAfter(end_date)){
                return
            }
        }

        const tmp = {
            id: reservation.id,
            date: reservation.date,
            status: reservation.status,
            restaurant: {
                name: reservation.Restaurant.restaurant_name,
                address: reservation.Restaurant.restaurant_address,
                table: {
                    name: reservation.Table.table_name,
                    capacity: reservation.Table.table_capacity
                }
            }
        }

        ret.push(tmp)
    })
    
    return res.status(200).send({
        message: "Berhasil mendapatkan semua reservasi",
        reservations: ret
    })
}

const updateReservasi = async (req,res) => {
    const schemaBody = Joi.object({
        table_id: Joi.number().required().messages({
            "any.required": "ID table harus diisi",
            "number.base": "ID table harus berupa angka"
        }),
        reservation_date: Joi.date().required().messages({
            "any.required": "Tanggal reservasi harus diisi",
            "date.base": "Tanggal reservasi harus berupa tanggal"
        }),
        reservation_status: Joi.string().valid(["WAITING_APPROVAL","APPROVED",'REJECTED']).required().messages({
            "any.required": "Status reservasi harus diisi",
            "string.base": "Tanggal reservasi harus berupa teks",
            "valid.base": "Input status tidak sesuai"
        }),
    })
    const schemaParam = Joi.object({
        id: Joi.number().required().messages({
            "any.required": "ID reservasi harus diisi",
            "number.base": "ID reservasi harus berupa angka"
        })
    })
    try{
        await schemaBody.validateAsync(req.body,{
            convert: true
        })
        await schemaParam.validateAsync(req.body,{
            convert: true
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
    
    // not found
    let reservation = await Reservation.getById(req.params.id);
    if(!reservation) {
        return res.status(404).send({
            message: "Reservasi tidak ditemukan"
        })
    }

    const { table_id, reservation_date, reservation_status } = req.body

    // update
    const update = await Reservation.update({
        table_id: table_id,
        reservation_date: reservation_date,
        reservation_status: reservation_status
    }, {
        where: {
            reservation_id: reservation.reservation_id,
        }
    })
    
    reservation = Reservation.getById(req.params.id);

    return res.status(201).json({
        message: "Reservasi berhasil diubah",
        data: reservation
    })
}

module.exports = {
    addReservasi,
    rescheduleReservasi,
    getAllReservasi,
    updateReservasi
}