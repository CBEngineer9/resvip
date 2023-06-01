const { Table } = require('../database/models')

const tableValid = async (value, helpers) => {
    const table = await Table.findByPk(value)
    if(!table){
        throw new Error('Meja tidak ditemukan')
    }

    return value
}

module.exports = tableValid