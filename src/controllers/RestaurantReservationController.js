const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment')
const { Reservation, Table, Slot, Seeker } = require('../database/models')
const reservationValid = require('../validations/reservationValid')
const ExpressController = require('./_ExpressController')
const NotFoundError = require('../errors/NotFoundError')

//restaurant get one reservasi by id
class RestaurantReservationController extends ExpressController {
    async insertSlot(req, res){
        const schema = Joi.object({
            start_time: Joi.date().format('d HH:mm'),
            end_time: Joi.date().format('d HH:mm'),
        })

        const validated = await schema.validateAsync(req.body);

        const new_slot = await Slot.create({
            restaurant_id: req.user.restaurant_id,
            start_time: validated.start_time,
            end_time: validated.end_time,
        })

        return res.status(201).json({
            message: "Berhasil membuat slot baru",
            slot: new_slot
        })
    }
    
    async updateSlot(req,res){
        
        throw new Error("Not Yet Implemented")
    }

    async deleteSlot(req,res){
        const selected_slot = await Slot.findByPk(req.params.id);
        if (!selected_slot) {
            throw new NotFoundError("Slot tidak ditemukan", {
                id: req.params.id
            })
        }
        
        await selected_slot.destroy();

        return res.status(200).json({
            message: "Berhasil menghapus slot",
            slot: selected_slot
        })
    }


    async getReservationById(req,res) {
        const schema = Joi.object({
            reservation_id: Joi.number().required().external(reservationValid).messages({
                "any.required": "ID reservasi harus diisi",
                "number.base": "ID reservasi harus berupa angka"
            })
        })
        await schema.validateAsync(req.params,{
            convert: true
        })
    
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
                    model: Seeker,
                    attributes: [
                        ['seeker_id', 'seeker_id']
                    ]
                }
            ]
        })
    
        if(reservation.restaurant_id != req.user.id){
            return res.status(403).send({
                message: 'Anda bukan pemilik reservasi ini'
            })
        }
    
        return res.status(200).send({
            reservation: {
                id: reservation.id,
                table: {
                    name: reservation.Table.table_name,
                    capacity: reservation.Table.table_capacity
                },
                seeker_id: reservation.Seeker.seeker_id,
                tanggal: moment(reservation.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                jam: `${moment(reservation.Slot.start_time).format('HH:mm')} - ${moment(reservation.Slot.end_time).format('HH:mm')}`,
                status: reservation.status,
            }
        })
    }
    
    //restaurant get all reservasi
    async getAllReservation(req,res) {
        const schema = Joi.object({
            start_date: Joi.date().format('DD/MM/YYYY').optional().messages({
                "date.format": "Format tanggal harus DD/MM/YYYY"
            }),
            end_date: Joi.date().format('DD/MM/YYYY').optional().messages({
                "date.format": "Format tanggal harus DD/MM/YYYY"
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
    
        let { start_date, end_date } = req.body
    
        const reservations = await Reservation.findAll({
            where: {
                restaurant_id: req.user.id
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
                    model: Seeker,
                    attributes: [
                        ['seeker_id', 'seeker_id']
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
                table: {
                    name: reservation.Table.table_name,
                    capacity: reservation.Table.table_capacity
                },
                seeker_id: reservation.Seeker.seeker_id,
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
    
    //restaurant acc tolak reservasi???
    async updateReservasi(req,res){
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
}

module.exports = new RestaurantReservationController()