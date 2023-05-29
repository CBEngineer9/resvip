const Joi = require('joi')
const { Reservation, Seeker, Table } = require('../database/models')

const addReservasi = async (req,res) => {
    const schema = Joi.object({
        seeker_id: Joi.number().required().messages({
            "any.required": "ID seeker harus diisi",
            "number.base": "ID seeker harus berupa angka"
        }),
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

    const { seeker_id, table_id, reservation_date } = req.body

    const reservation = await Reservation.create({
        seeker_id: seeker_id,
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
    await reservation.update({
        reservation_date: reservation_date
    })

    return res.status(200).send({
        message: "Reservasi berhasil di-reschedule",
    })
}

const getAllReservasi = async (req,res) => {

}

module.exports = {
    addReservasi,
    rescheduleReservasi,
    getAllReservasi
}