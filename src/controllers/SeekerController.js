const Joi = require("joi");
const { User, sequelize } = require("../database/models");
const { Op, QueryTypes } = require("sequelize");
const { Sequelize } = require("../database/models");
const HereAPIService = require("../services/HereAPIService");

class SeekerController {
    /**
     * controller untuk Get restaurant
     * @author CBEngineer 
     */
    async getRestaurant(req,res,next) {
        const validator = Joi.object({
            cuisine: Joi.string().optional(),
            price_min: Joi.number().optional(),
            price_max: Joi.number().optional(),
            near_coords: Joi.object({
                lat: Joi.number(),
                lng: Joi.number()
            }),
            near: Joi.string(),
        }).and('price_min','price_max').oxor('near','near_coords')

        try {
            const validated = await validator.validateAsync(req.body)

            // handle requests
            if (validated.cuisine) {
                // TODO
            }
            if (validated.price_max) {
                
            }
            if (validated.price_min) {
                
            }
            if (validated.near_coords) {
                const thresh = Math.pow(1,2);
                // const restaurant = await User.scope('restaurants').findAll({
                //     where: Sequelize.literal(`power(company_lat - ${validated.near_coords.lat},2) + power(company_long - ${validated.near_coords.lng},2) <= ${thresh}`)
                // })
                // console.log(restaurant);
                
                const rests = await sequelize.query(`select *, (power(company_lat - ${validated.near_coords.lat},2) + power(company_long - ${validated.near_coords.lng},2)) as "dist" from users where "dist" <= ${thresh} order by dist desc`,{
                    type: QueryTypes.SELECT
                })
                // console.log(rests);
                return res.status(200).json({
                    query_near_coords: validated.near_coords,
                    results: rests
                });

            } else if (validated.near) {
                const thresh = Math.pow(1,2);

                const coords = await HereAPIService.getCoords(validated.near)
                const rests = await sequelize.query(`select *, (power(company_lat - ${coords.pos.lat},2) + power(company_long - ${coords.pos.lng},2)) as "dist" from users where "dist" <= ${thresh} order by dist desc`,{
                    type: QueryTypes.SELECT
                })

                return res.status(200).json({
                    query_near: validated.near,
                    results: rests
                });
            }

            return res.status(500).send('glbb')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new SeekerController();