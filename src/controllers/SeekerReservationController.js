const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment')
const { Reservation, Table, Slot, Restaurant } = require('../database/models')
const tableValid = require('../validations/tableValid')
const slotValid = require('../validations/slotValid')
const reservationValid = require('../validations/reservationValid')

//seeker add reservasi
const addReservation = async (req,res) => {
    const schema = Joi.object({
        table_id: Joi.number().required().external(tableValid).messages({
            "any.required": "ID table harus diisi",
            "number.base": "ID table harus berupa angka"
        }),
        slot_id: Joi.number().required().slotValid().messages({
            "any.required": "ID slot harus diisi",
            "number.base": "ID slot harus berupa angka"
        }),
        reservation_date: Joi.date().format('DD/MM/YYYY').required().messages({
            "any.required": "Tanggal reservasi harus diisi",
            "date.base": "Tanggal reservasi harus berupa tanggal",
            "date.format": "Format tanggal harus DD/MM/YYYY"
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

    const { table_id, slot_id, reservation_date } = req.body

    //match table and slot
    const slot = await Slot.findByPk(slot_id)
    const table = await Table.findByPk(table_id)
    if(table.restaurant_id != slot.restaurant_id){
        return res.status(400).json({
            message: "Mohon pilih slot restoran yang sesuai"
        })
    }
    
    //cek slot & table available
    const reservationAda = await Reservation.findOne({
        where: {
            table_id: table_id,
            reservation_date: reservation_date,
            slot_id: slot_id
        }
    })

    if(reservationAda){
        return res.status(400).json({
            message: "Slot yang dipilih sudah direservasi, mohon pilih slot atau meja lain"
        })
    }

    const reservation = await Reservation.create({
        seeker_id: req.user.id,
        table_id: table_id,
        slot_id: slot_id,
        reservation_date: moment(reservation_date).format('YYYY-MM-DD'),
        reservation_status: 'WAITING_APPROVAL'
    })
    return res.status(201).json({
        message: "Reservasi berhasil dibuat",
        reservation: reservation
    })
}

//seeker resechedule reservasi
const rescheduleReservation = async (req,res) => {
    const schema = Joi.object({
        reservation_id: Joi.number().required().external(reservationValid).messages({
            "any.required": "ID reservasi harus diisi",
            "number.base": "ID reservasi harus berupa angka"
        }),
        reservation_date: Joi.date().format('DD/MM/YYYY').required().messages({
            "any.required": "Tanggal reschedule harus diisi",
            "date.base": "Tanggal reschedule harus berupa tanggal",
            "date.format": "Format tanggal harus DD/MM/YYYY"
        }),
        slot_id: Joi.number().required().messages({
            "any.required": "ID slot harus diisi",
            "number.base": "ID slot harus berupa angka"
        }),
        table_id: Joi.number().required().external(tableValid).messages({
            "any.required": "ID table harus diisi",
            "number.base": "ID table harus berupa angka"
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

    const { reservation_id, reservation_date, table_id, slot_id } = req.body
    const reservation = await Reservation.findByPk(reservation_id)

    if(reservation.seeker_id != req.user.id){
        return res.status(403).send({
            message: 'Anda bukan pemilik reservasi ini'
        })
    }

    //match table and slot
    const slot = await Slot.findByPk(slot_id)
    const table = await Table.findByPk(table_id)
    if(table.restaurant_id != slot.restaurant_id){
        return res.status(400).json({
            message: "Mohon pilih slot restoran yang sesuai"
        })
    }
    
    //cek slot & table available
    const reservationAda = await Reservation.findOne({
        where: {
            table_id: table_id,
            reservation_date: reservation_date,
            slot_id: slot_id
        }
    })
    if(reservationAda){
        return res.status(400).json({
            message: "Slot yang dipilih sudah direservasi, mohon pilih slot atau meja lain"
        })
    }

    await reservation.update({
        table_id: table_id,
        slot_id: slot_id,
        reservation_date: moment(reservation_date).format('YYYY-MM-DD'),
        reservation_status: 'WAITING_APPROVAL'
    })

    return res.status(200).send({
        message: "Reservasi berhasil di-reschedule",
        reservation: reservation
    })
}


//seeker cancel reservasi
const cancelReservation = async (req,res) => {
    const { reservation_id } = req.params
    const reservation = await Reservation.findByPk(reservation_id)

    if(reservation.seeker_id != req.user.id){
        return res.status(403).send({
            message: 'Anda bukan pemilik reservasi ini'
        })
    }

    await reservation.destroy()

    return res.status(200).send({
        message: "Reservasi berhasil dibatalkan",
        reservation: reservation
    })
}

//seeker get one reservasi by id
const getReservationById = async (req,res) => {
    const schema = Joi.object({
        reservation_id: Joi.number().required().external(reservationValid).messages({
            "any.required": "ID reservasi harus diisi",
            "number.base": "ID reservasi harus berupa angka"
        })
    })
    try{
        await schema.validateAsync(req.params,{
            convert: true
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    const { reservation_id } = req.params
    const reservation = await Reservation.findByPk(reservation_id, {
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
                model: Slot,
                attributes: [
                    ['start_time', 'start_time'],
                    ['end_time', 'end_time'],
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

    if(reservation.seeker_id != req.user.id){
        return res.status(403).send({
            message: 'Anda bukan pemilik reservasi ini'
        })
    }

    return res.status(200).send({
        reservation: {
            id: reservation.id,
            restaurant: {
                name: reservation.Restaurant.restaurant_name,
                address: reservation.Restaurant.restaurant_address,
                table: {
                    name: reservation.Table.table_name,
                    capacity: reservation.Table.table_capacity
                }
            },
            tanggal: moment(reservation.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            jam: `${moment(reservation.Slot.start_time).format('HH:mm')} - ${moment(reservation.Slot.end_time).format('HH:mm')}`,
            status: reservation.status,
        }
    })
}

//seeker get history reservasi
const getHistoryReservation = async (req,res) => {
    const schema = Joi.object({
        start_date: Joi.date().format('DD/MM/YYYY').optional().messages({
            "date.format": "Format tanggal harus DD/MM/YYYY"
        }),
        end_date: Joi.date().format('DD/MM/YYYY').optional().messages({
            "date.format": "Format tanggal harus DD/MM/YYYY"
        }),
        restaurant: Joi.string().optional().messages({
            "string.base": "Nama restaurant harus berupa teks"
        })
    })
    try{
        await schema.validateAsync(req.query,{
            convert: true
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    let { start_date, end_date, restaurant } = req.body
    if(!restaurant){
        restaurant = ''
    }

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
                model: Slot,
                attributes: [
                    ['start_time', 'start_time'],
                    ['end_time', 'end_time'],
                ]
            },
            {
                model: Restaurant,
                restaurant_name: {
                    [Op.like]: `%${restaurant}%`
                },
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
            if(moment(reservation.date).isBefore(moment(start_date,'DD/MM/YYYY'))){
                return
            }
        }
        if(end_date){
            if(moment(reservation.date).isAfter(moment(end_date,'DD/MM/YYYY'))){
                return
            }
        }
        if(restaurant){
            if(reservation.Restaurant.restaurant_name.toLowerCase() != restaurant.toLowerCase()){
                return
            }
        }

        const tmp = {
            id: reservation.id,
            restaurant: {
                name: reservation.Restaurant.restaurant_name,
                address: reservation.Restaurant.restaurant_address,
                table: {
                    name: reservation.Table.table_name,
                    capacity: reservation.Table.table_capacity
                }
            },
            tanggal: moment(reservation.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
            jam: `${moment(reservation.Slot.start_time).format('HH:mm')} - ${moment(reservation.Slot.end_time).format('HH:mm')}`,
            status: reservation.status,
        }

        ret.push(tmp)
    })
    
    return res.status(200).send({
        message: "Berhasil mendapatkan semua reservasi",
        reservations: ret
    })
}

const SeekerReservationController = {
    addReservation,
    rescheduleReservation,
    cancelReservation,
    getReservationById,
    getHistoryReservation
}

module.exports = SeekerReservationController