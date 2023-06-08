const ResponseError = require("./ResponseError.js");

class ForbiddenError extends ResponseError {

    /**
     * Creates Forbidden error with message
     * @param {string} message optional forbidden message
     */
    constructor(message = "You are not allowed to use this endpoint") {
        super(403, message, "ForbiddenError");
    }
}

module.exports = ForbiddenError