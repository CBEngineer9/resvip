const ResponseError = require("./ResponseError.js");

class NotFoundError extends ResponseError {
    /**
     * @property {object} notFoundField
     */
    notFoundField;

    /**
     * Creates new not found error
     * @param {string} message Not Found message
     * @param {object} notFoundField Object containing the not found field name with original value
     */
    constructor(message = "Not Found", notFoundField) {
        super(404, message, "Not Found Error");
        this.notFoundField = notFoundField
    }
}

module.exports = NotFoundError