const ResponseError = require("./ResponseError.js");

class AuthenticationError extends ResponseError {
    /**
     * Creates authentication error with message
     * @param {string} message authentication error message
     */
    constructor(message = "Authentication Error") {
        super(401, message, "AuthenticationError");
    }
}

module.exports = AuthenticationError