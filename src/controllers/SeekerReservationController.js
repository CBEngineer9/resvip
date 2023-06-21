const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment')
const { Reservation, Table, Slot, Restaurant, Seeker } = require('../database/models')
const { Op } = require('sequelize')
const tableValid = require('../validations/tableValid')
const slotValid = require('../validations/slotValid')
const ExpressController = require('./_ExpressController')
const reservationValid = require('../validations/reservationValid')
const midtransClient = require('midtrans-client');
const { response } = require('express')

class SeekerReservationController extends ExpressController {
    //seeker add reservasi
    async addReservation (req,res) {
        const schema = Joi.object({
            table_id: Joi.number().required().external(tableValid).messages({
                "any.required": "ID table harus diisi",
                "number.base": "ID table harus berupa angka"
            }),
            slot_id: Joi.number().required().external(slotValid).messages({
                "any.required": "ID slot harus diisi",
                "number.base": "ID slot harus berupa angka"
            }),
            reservation_date: Joi.date().format('DD/MM/YYYY').required().messages({
                "any.required": "Tanggal reservasi harus diisi",
                "date.base": "Tanggal reservasi harus berupa tanggal",
                "date.format": "Format tanggal harus DD/MM/YYYY"
            }),
            bank_name: Joi.string().valid("bca", "bni", "bri", "BCA", "BNI", "BRI").required(),
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

        const { table_id, slot_id, reservation_date } = req.body;

        //match table and slot
        const slot = await Slot.findByPk(slot_id)
        const table = await Table.findByPk(table_id)
        if(table.restaurant_id != slot.restaurant_id){
            return res.status(400).json({
                message: "Mohon pilih slot restoran yang sesuai"
            })
        }
    
        //cek slot day and reservation day
        if(slot.slot_day != moment(reservation_date, 'DD/MM/YYYY').format('dddd').toUpperCase()){
            return res.status(400).json({
                message: "Mohon pilih slot sesuai tanggal reservasi"
            })
        }
        
        //cek slot & table available
        const reservationAda = await Reservation.findOne({
            where: {
                table_id: table_id,
                reservation_date: moment(reservation_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                slot_id: slot_id
            }
        })

        if(reservationAda){
            return res.status(400).json({
                message: "Slot yang dipilih sudah direservasi, mohon pilih slot atau meja lain"
            })
        }

        const payment_order_id = Math.random().toString(36).slice(1, 6);

        // random 5 character for midtrans_order_id
        const reservation = await Reservation.create({
            seeker_id: req.user.id,
            table_id: table_id,
            slot_id: slot_id,
            reservation_date: moment(reservation_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            reservation_status: 'WAITING_APPROVAL',
            paid_down_payment: false,
            midtrans_order_id: payment_order_id,
        })

        // charge midtrans
        const core = new midtransClient.CoreApi({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        });
        const restaurant = await Restaurant.findByPk(table.restaurant_id);
        const seeker = await Seeker.findByPk(req.user.id);
        // 5 persen potongan dp
        const parameter = {
            "payment_type": "bank_transfer",
            "transaction_details": {
                "gross_amount": restaurant.restaurant_down_payment * 105/100,
                "order_id": payment_order_id,
            },
            "bank_transfer":{
                "bank": req.body.bank_name.toLowerCase(),
            },
            "customer_details": {
                "first_name": seeker.username
            }
        };
        core.charge(parameter)
            .then((chargeResponse)=>{
                return res.status(201).json({
                    message: "Reservasi berhasil dibuat",
                    reservation: {
                        table_id: reservation.table_id,
                        slot_id: reservation.slot_id,
                        reservation_date: moment(reservation.reservation_date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                        reservation_status: 'WAITING_APPROVAL'
                    },
                    payment: chargeResponse
                })
            })
            .catch((e)=>{
                return res.status(400).send({
                    message: e.toString()
                })
            });        
    }

    //seeker resechedule reservasi
    async rescheduleReservation(req,res) {
        const schema1 = Joi.object({
            reservation_id: Joi.number().required().external(reservationValid).messages({
                "any.required": "ID reservasi harus diisi",
                "number.base": "ID reservasi harus berupa angka"
            })
        })
        const schema2 = Joi.object({
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
            await schema1.validateAsync(req.params,{
                convert: true
            })
            await schema2.validateAsync(req.body,{
                convert: true
            })
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }

        const { reservation_date, table_id, slot_id } = req.body
        const { reservation_id } = req.params
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

        //cek slot day and reservation day
        if(slot.slot_day != moment(reservation_date, 'DD/MM/YYYY').format('dddd').toUpperCase()){
            return res.status(400).json({
                message: "Mohon pilih slot sesuai tanggal reservasi"
            })
        }
        
        //cek slot & table available
        const reservationAda = await Reservation.findOne({
            where: {
                table_id: table_id,
                reservation_date: moment(reservation_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                slot_id: slot_id
            }
        })
        if(reservationAda && reservationAda.reservation_id!=reservation_id){
            return res.status(400).json({
                message: "Slot yang dipilih sudah direservasi, mohon pilih slot atau meja lain"
            })
        }

        await reservation.update({
            table_id: table_id,
            slot_id: slot_id,
            reservation_date: moment(reservation_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            reservation_status: 'WAITING_APPROVAL'
        })

        return res.status(200).send({
            message: "Reservasi berhasil di-reschedule",
            reservation: {
                table_id: reservation.table_id,
                slot_id: reservation.slot_id,
                reservation_date: moment(reservation.reservation_date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                reservation_status: 'WAITING_APPROVAL'
            }
        })
    }


    //seeker cancel reservasi
    async cancelReservation(req,res){
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
        const reservation = await Reservation.findByPk(reservation_id)

        if(reservation.seeker_id != req.user.id){
            return res.status(403).send({
                message: 'Anda bukan pemilik reservasi ini'
            })
        }

        await reservation.destroy()

        return res.status(200).send({
            message: "Reservasi berhasil dibatalkan",
            reservation: {
                table_id: reservation.table_id,
                slot_id: reservation.slot_id,
                reservation_date: moment(reservation.reservation_date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                reservation_status: reservation.reservation_status
            }
        })
    }

    //seeker get one reservasi by id
    async getReservationById(req,res){
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
        const reservationComplete = await Reservation.findByPk(reservation_id)
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
                        ['table_number', 'table_number'],
                    ],
                    include: {
                        model: Restaurant,
                        attributes: [
                            ['restaurant_name', 'restaurant_name'],
                            ['restaurant_address', 'restaurant_address']
                        ]
                    }
                },
                {
                    model: Slot,
                    attributes: [
                        ['start_time', 'start_time'],
                        ['end_time', 'end_time'],
                    ]
                },
            ]
        })

        if(reservationComplete.seeker_id != req.user.id){
            return res.status(403).send({
                message: 'Anda bukan pemilik reservasi ini'
            })
        }

        return res.status(200).send({
            reservation: {
                id: reservation.dataValues.id,
                restaurant: {
                    name: reservation.Table.Restaurant.restaurant_name,
                    address: reservation.Table.Restaurant.restaurant_address,
                    table_number: reservation.Table.table_number
                },
                tanggal: moment(reservation.dataValues.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                jam: `${moment(reservation.Slot.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(reservation.Slot.end_time, 'HH:mm:ss').format('HH:mm')}`,
                status: reservation.dataValues.status,
            }
        })
    }

    //seeker get history reservasi
    async getHistoryReservation (req,res) {
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
                        ['table_number', 'table_number'],
                    ],
                    include: {
                        model: Restaurant,
                        restaurant_name: {
                            [Op.like]: `%${restaurant}%`
                        },
                        attributes: [
                            ['restaurant_name', 'restaurant_name'],
                            ['restaurant_address', 'restaurant_address']
                        ]
                    }
                },
                {
                    model: Slot,
                    attributes: [
                        ['start_time', 'start_time'],
                        ['end_time', 'end_time'],
                    ]
                },
            ]
        })

        const ret = []
        reservations.forEach(reservation => {
            if(start_date){
                if(moment(reservation.reservation_date).isBefore(moment(start_date,'DD/MM/YYYY'))){
                    return
                }
            }
            if(end_date){
                if(moment(reservation.reservation_date).isAfter(moment(end_date,'DD/MM/YYYY'))){
                    return
                }
            }
            if(restaurant){
                if(reservation.Table.Restaurant.restaurant_name.toLowerCase() != restaurant.toLowerCase()){
                    return
                }
            }

            const tmp = {
                id: reservation.dataValues.id,
                restaurant: {
                    name: reservation.Table.Restaurant.restaurant_name,
                    address: reservation.Table.Restaurant.restaurant_address,
                    table_number: reservation.Table.table_number
                },
                tanggal: moment(reservation.dataValues.date, 'YYYY-MM-DD').format('DD MMM YYYY'),
                jam: `${moment(reservation.Slot.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(reservation.Slot.end_time, 'HH:mm:ss').format('HH:mm')}`,
                status: reservation.dataValues.status,
            }

            ret.push(tmp)
        })
        return res.status(200).send({
            message: "Berhasil mendapatkan semua reservasi",
            reservations: ret
        })
    }

    async notifyPayment (req, res) {
        let apiClient = new midtransClient.Snap({
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        });
    
        apiClient.transaction.notification(notificationJson)
        .then(async (statusResponse)=>{
            let orderId = statusResponse.order_id;
            let transactionStatus = statusResponse.transaction_status;
            let fraudStatus = statusResponse.fraud_status;
    
            console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);
    
            // Sample transactionStatus handling logic
    
            if (transactionStatus == 'capture'){
                if (fraudStatus == 'challenge'){
                    // TODO set transaction status on your database to 'challenge'
                    // and response with 200 OK
                } else if (fraudStatus == 'accept'){
                    // TODO set transaction status on your database to 'success'
                    // and response with 200 OK
                }
            } else if (transactionStatus == 'settlement'){
                // TODO set transaction status on your database to 'success'
                // and response with 200 OK
                const update = await reservation.update({
                    paid_down_payment: true,
                }, {
                    where: {
                        order_id: statusResponse.order_id
                    }
                })
            } else if (transactionStatus == 'cancel' ||
              transactionStatus == 'deny' ||
              transactionStatus == 'expire'){
              // TODO set transaction status on your database to 'failure'
              // and response with 200 OK
            } else if (transactionStatus == 'pending'){
              // TODO set transaction status on your database to 'pending' / waiting payment
              // and response with 200 OK
            }
        });
    }
}



module.exports = new SeekerReservationController()