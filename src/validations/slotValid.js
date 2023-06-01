const { Slot } = require('../database/models')

const slotValid = async (value, helpers) => {
    const table = await Slot.findByPk(value)
    if(!table){
        throw new Error('Slot tidak ditemukan')
    }

    return value
}

module.exports = slotValid