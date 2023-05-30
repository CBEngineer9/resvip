const AdminMiddleware = (req,res,next) => {
    if(req.user.role != 'admin'){
        return res.status(403).send({
            message: 'Anda tidak boleh mengakses endpoint ini'
        })
    }

    next()
}

const SeekerMiddleware = (req,res,next) => {
    if(req.user.role != 'seeker'){
        return res.status(403).send({
            message: 'Anda tidak boleh mengakses endpoint ini'
        })
    }

    next()
}

const RestaurantMiddleware = (req,res,next) => {
    if(req.user.role != 'restaurant'){
        return res.status(403).send({
            message: 'Anda tidak boleh mengakses endpoint ini'
        })
    }

    next()
}

module.exports = {
    AdminMiddleware,
    SeekerMiddleware,
    RestaurantMiddleware
}