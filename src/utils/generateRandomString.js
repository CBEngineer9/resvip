/**
 * generate random alphanum string
 * @param {int} length length of string
 * @returns {String} random alphanum string
 */
function generateRandomString(length = 16){
    const random = Math.random().toString(36).slice(2,2+length)
    return random
}

module.exports = generateRandomString