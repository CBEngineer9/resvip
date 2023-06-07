const { Request, Response, NextFunction } = require("express");

/**
 * Abstract class for all express controller.
 * All controllers should extend from this class
 */
class ExpressController{
    /**
     * Wrap each method in wrapper
     */
    constructor(){
        for (let property of Object.getOwnPropertyNames(this.constructor.prototype)){

            if(typeof this.constructor.prototype[property] == "function" && property != "constructor"){
                const method = this.constructor.prototype[property]
                this.constructor.prototype[property] = this.wrapResource(method);
            }
        }
    }

    /**
     * Wrap a function and returns res
     * @param func function to wrap
     */
    wrapResource(func){
        return async (req,res,next)=>{
            try{
                const resRes = await func(req,res,next);
                // res.status(resRes.code).json(resRes);
            }
            catch (e){
                next(e);
            }
        }
    }
}

module.exports = ExpressController