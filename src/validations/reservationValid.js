const { Reservasi } = require('../database/models')

const reservationValid = async (value, helpers) => {
    const reservation = await Reservasi.findByPk(value)
    if(!reservation){
        throw new Error('Reservasi tidak ditemukan')
    }

    return value
}

module.exports = reservationValid