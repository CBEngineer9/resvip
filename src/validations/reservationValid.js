const { Reservation } = require('../database/models')

const reservationValid = async (value, helpers) => {
    const reservation = await Reservation.findByPk(value)
    if(!reservation){
        throw new Error('Reservasi tidak ditemukan')
    }

    return value
}

module.exports = reservationValid