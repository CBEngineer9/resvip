const jwt = require('jsonwebtoken')
const env = require("../configs/env.config.js")

const AuthMiddleware = (req, res, next) => {
    let token = req.headers['x-auth-token']
    if (!token) {
        // return res.status(401).send('Unauthorized')
        return next(new jwt.JsonWebTokenError("Authorization required. Please check your JWT Token"))
    }

    try {
        const user = jwt.verify(token, env('JWT_KEY'))
        req.user = user
        next()
    } catch (err) {
        // return res.status(400).send('Invalid API Key')
        return next(new jwt.JsonWebTokenError("Authorization required. Please check your JWT Token"))
    }
}

module.exports = AuthMiddleware