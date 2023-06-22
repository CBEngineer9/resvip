const Joi = require('joi').extend(require('@joi/date'))
const moment = require('moment')
const { Reservation, Table, Slot, Seeker, sequelize } = require('../database/models')
const reservationValid = require('../validations/reservationValid')
const ExpressController = require('./_ExpressController')
const NotFoundError = require('../errors/NotFoundError')

//restaurant get one reservasi by id
class RestaurantReservationController extends ExpressController {
    /**
     * Inserts new reservation slot
     * @author CBEngineer
     */
    async insertSlot(req, res){
        const schema = Joi.object({
            slot_day: Joi.number().integer().min(0).max(6).required().messages({
                "any.required": "Username harus diisi",
                "number.integer": "Slot harus berupa angka 0 sampai 6",
                "number.min": "Slot harus berupa angka 0 sampai 6",
                "number.max": "Slot harus berupa angka 0 sampai 6",
            }),
            start_time: Joi.date().format('HH:mm').required().messages({
                "any.required": "Username harus diisi",
                "date.format": "start_time harus memiliki format HH:mm"
            }),
            end_time: Joi.date().format('HH:mm').greater(Joi.ref('start_time')).required().messages({
                "any.required": "Username harus diisi",
                "date.format": "end_time harus memiliki format HH:mm",
                "date.greater": "end_time harus melebihi start_time"
            }),
        })

        const validated = await schema.validateAsync(req.body);

        const new_slot = await Slot.create({
            restaurant_id: req.user.id,
            slot_day: validated.slot_day+1,
            start_time: validated.start_time,
            end_time: validated.end_time,
        })

        return res.status(201).json({
            message: "Berhasil membuat slot baru",
            slot: new_slot
        })
    }
    
    /**
     * Updates reservation slot
     * @author CBEngineer
     */
    async updateSlot(req,res){
        // get slot
        const selected_slot = await Slot.findByPk(req.params.id)
        if (selected_slot == null) {
            throw new NotFoundError("Slot tidak ditemukan", {
                id: req.params.id
            })
        }

        // validate body
        const schema = Joi.object({
            slot_day: Joi.number().integer().min(0).max(6).optional().messages({
                "number.integer": "Slot harus berupa angka 0 sampai 6",
                "number.min": "Slot harus berupa angka 0 sampai 6",
                "number.max": "Slot harus berupa angka 0 sampai 6",
            }),
            start_time: Joi.date().format('HH:mm').optional().messages({
                "date.format": "start_time harus memiliki format HH:mm"
            }),
            end_time: Joi.date().format('HH:mm').optional().messages({
                "date.format": "end_time harus memiliki format HH:mm",
                "date.greater": "end_time harus melebihi start_time"
            }),
        }).or('slot_day','start_time','end_time')

        const validated = await schema.validateAsync(req.body);
        await selected_slot.update(validated)

        return res.status(200).json({
            message: "Berhasil mengupdate slot",
            slot: selected_slot
        })
    }

    /**
     * Deletes reservation slot
     * @author CBEngineer
     */
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
        const reservationComplete = await Reservation.findByPk(reservation_id, {
            include: {
                model: Table,
            },
        })
        const reservation = await Reservation.findByPk(reservation_id, {
            attributes: [
                ['reservation_id', 'id'],
                ['reservation_date', 'date'],
                ['reservation_status', 'status'],
                ['paid_down_payment', 'paid_down_payment']
            ],
            include: [
                {
                    model: Table,
                    attributes: [
                        ['table_number', 'table_number'],
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
    
        if(reservationComplete.Table.restaurant_id != req.user.id){
            return res.status(403).send({
                message: 'Anda bukan pemilik reservasi ini'
            })
        }
    
        return res.status(200).send({
            reservation: {
                id: reservation.dataValues.id,
                table_number: reservation.Table.table_number,
                seeker_id: reservation.Seeker.seeker_id,
                tanggal: moment(reservation.dataValues.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                jam: `${moment(reservation.Slot.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(reservation.Slot.end_time, 'HH:mm:ss').format('HH:mm')}`,
                status: reservation.dataValues.status,
                down_payment: reservation.dataValues.paid_down_payment==1 ? 'Paid' : 'Not Paid'
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
            where: sequelize.where(sequelize.col('Table.restaurant_id'), req.user.id),
            attributes: [
                ['reservation_id', 'id'],
                ['reservation_date', 'date'],
                ['reservation_status', 'status'],
                ['paid_down_payment', 'paid_down_payment']
            ],
            include: [
                {
                    model: Table,
                    attributes: [
                        ['table_number', 'table_number'],
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
    
            const tmp = {
                id: reservation.dataValues.id,
                table_number: reservation.Table.table_number,
                seeker_id: reservation.Seeker.seeker_id,
                tanggal: moment(reservation.dataValues.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                jam: `${moment(reservation.Slot.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(reservation.Slot.end_time, 'HH:mm:ss').format('HH:mm')}`,
                status: reservation.dataValues.status,
                down_payment: reservation.dataValues.paid_down_payment==1 ? 'Paid' : 'Not Paid'
            }
    
            ret.push(tmp)
        })
        
        return res.status(200).send({
            message: "Berhasil mendapatkan semua reservasi",
            reservations: ret
        })
    }
    
    // accept / tolak reservasi
    async updateReservation(req,res){
        const schemaBody = Joi.object({
            table_id: Joi.number().required().messages({
                "any.required": "ID table harus diisi",
                "number.base": "ID table harus berupa angka"
            }),
            slot_id: Joi.string().required().messages({
                "any.required": "ID Slot harus diisi",
                "string.base": "ID Slot harus berupa string"
            }),
            reservation_status: Joi.string().valid("WAITING_APPROVAL","APPROVED",'REJECTED').required().messages({
                "any.required": "Status reservasi harus diisi",
                "string.base": "Tanggal reservasi harus berupa teks",
                "valid.base": "Input status tidak sesuai"
            }),
        })
        const schemaParam = Joi.object({
            reservation_id: Joi.number().required().messages({
                "any.required": "ID reservasi harus diisi",
                "number.base": "ID reservasi harus berupa angka"
            })
        })
        try{
            await schemaBody.validateAsync(req.body,{
                convert: true
            })
            await schemaParam.validateAsync(req.params,{
                convert: true
            })
        } catch (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        
        // not found
        let reservation = await Reservation.findByPk(req.params.reservation_id);
        if(!reservation) {
            return res.status(404).send({
                message: "Reservasi tidak ditemukan!"
            })
        }
    
        const { table_id, slot_id, reservation_status } = req.body
        
        const table = await Table.findByPk(table_id);
        if(!table) {
            return res.status(404).send({
                message: "Table tidak ditemukan!"
            })
        }
        const slot = await Slot.findByPk(slot_id);
        if(!slot) {
            return res.status(404).send({
                message: "Slot tidak ditemukan!"
            })
        }

        // update
        const update = await Reservation.update({
            table_id: table_id,
            slot_id: slot_id,
            reservation_status: reservation_status
        }, {
            where: {
                reservation_id: req.params.reservation_id,
            }
        })

        reservation = await Reservation.findByPk(req.params.reservation_id, {
            attributes: [
                ['reservation_id', 'id'],
                ['reservation_date', 'date'],
                ['reservation_status', 'status'],
                ['paid_down_payment', 'paid_down_payment']
            ],
            include: [
                {
                    model: Table,
                    attributes: [
                        ['table_number', 'table_number'],
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
    
        return res.status(201).json({
            message: "Reservasi berhasil diubah",
            reservation: {
                id: reservation.dataValues.id,
                table_number: reservation.Table.table_number,
                seeker_id: reservation.Seeker.seeker_id,
                tanggal: moment(reservation.dataValues.date, 'YYYY-MM-DD').format('DD MMMM YYYY'),
                jam: `${moment(reservation.Slot.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(reservation.Slot.end_time, 'HH:mm:ss').format('HH:mm')}`,
                status: reservation.dataValues.status,
                down_payment: reservation.dataValues.paid_down_payment==1 ? 'Paid' : 'Not Paid'
            }
        })
    }

    async insertTable(req, res) {
        const schemaBody = Joi.object({
            table_number: Joi.number().integer().required().messages({
                "number.integer": "Nomor table harus angka",
            }),
        })

        try {
            await schemaBody.validateAsync(req.body);
        }
        catch(e) {
            return res.status(400).send({
                message: e.toString()
            })
        }

        const table = await Table.findOne({
            where: {
                restaurant_id: req.user.id,
                table_number: req.body.table_number,
            }
        })

        if(table) {
            return res.status(400).send({
                message: "Table sudah pernah ditambahkan!"
            })
        }

        const new_table = await Table.create({
            restaurant_id: req.user.id,
            table_number: req.body.table_number,
        })

        return res.status(201).json({
            message: "Berhasil membuat slot baru",
            table: {
                table_id: new_table.table_id,
                table_number: new_table.table_number,
            }
        })
    }

    async getAllTables(req, res) {
        let tables = await Table.findAll({
            where: {
                restaurant_id: req.user.id
            }
        });
        tables = tables.map(table => {
            delete table.createdAt
            delete table.updatedAt
            return table
        })
        return res.status(200).send({
            table: tables
        })
    }
}

module.exports = new RestaurantReservationController()