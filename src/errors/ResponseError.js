class ResponseError extends Error {
    /**
     * @property status code
     */
    statusCode

    /**
     * Create Response Error with code 
     * @param {number} statusCode  HTTP status code
     * @param {string} message error message
     * @param {string} name error name
     */
    constructor(statusCode, message, name) {
        super();
        this.statusCode = statusCode
        this.message = message
        this.name = name
    }
}

module.exports = ResponseError