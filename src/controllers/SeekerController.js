const Joi = require("joi");
const { User, sequelize } = require("../database/models");
const { Op, QueryTypes } = require("sequelize");
const { Sequelize, Restaurant } = require("../database/models");
const HereAPIService = require("../services/HereAPIService");
const NotFoundError = require("../errors/NotFoundError");

class SeekerController {
    /**
     * controller untuk fetch restaurant
     * @author CBEngineer 
     */
    async fetchRestaurant(req,res,next) {
        const validator = Joi.object({
            cuisine: Joi.string().valid("INDONESIAN","ASIAN","WESTERN").optional().messages({
                "any.valid": "cuisine harus salah satu dari INDONESIAN, ASIAN, WESTERN"
            }),
            price_min: Joi.number().min(100).optional().messages({
                "number.min": "price_max harus lebih besar dari 100",
            }),
            price_max: Joi.number().min(100).greater(Joi.ref("price_min")).optional().messages({
                "number.min": "price_max harus lebih besar dari 100",
                "number.greater": "price_max harus lebih besar dari price_min",
            }),
            near_coords: Joi.object({
                lat: Joi.number(),
                lng: Joi.number()
            }).optional(),
            near: Joi.string().optional(),
        }).and('price_min','price_max').oxor('near','near_coords')

        try {
            const validated = await validator.validateAsync(req.body)
            const filter = {}

            // handle requests
            if (validated.cuisine) {
                filter.where.restaurant_cuisine = validated.cuisine
            }
            if (validated.price_max) {
                filter.where.restaurant_down_payment[Op.lte] = validated.price_max
            }
            if (validated.price_min) {
                filter.where.restaurant_down_payment[Op.gte] = validated.price_min
            }

            const restaurants = await Restaurant.findAll(filter)

            // TODO coords filter
            if (validated.near_coords) {
                // const thresh = Math.pow(1,2);
                // const restaurant = await User.scope('restaurants').findAll({
                //     where: Sequelize.literal(`power(company_lat - ${validated.near_coords.lat},2) + power(company_long - ${validated.near_coords.lng},2) <= ${thresh}`)
                // })
                // console.log(restaurant);
                for (const rest of restaurants) {
                    rest.restaurant_distance = Math.pow(rest.company_lat - validated.near_coords.lat,2) + Math.pow(rest.company_long - validated.near_coords.lng,2)
                }
                restaurants.sort((res1, res2) => {
                    return res1.dist - res2.dist
                })
                
                // const rests = await sequelize.query(`select *, (power(company_lat - ${validated.near_coords.lat},2) + power(company_long - ${validated.near_coords.lng},2)) as "dist" from users where "dist" <= ${thresh} order by dist desc`,{
                //     type: QueryTypes.SELECT
                // })
                // console.log(rests);

                // return res.status(200).json({
                //     query_near_coords: validated.near_coords,
                //     results: restaurants
                // });

            } else if (validated.near) {
                const thresh = Math.pow(1,2);

                const coords = await HereAPIService.getCoords(validated.near)
                for (const rest of restaurants) {
                    rest.restaurant_distance = Math.pow(rest.company_lat - coords.pos.lat,2) + Math.pow(rest.company_long-coords.pos.lng,2)
                }
                restaurants.sort((res1, res2) => {
                    return res1.dist - res2.dist
                })
                // const rests = await sequelize.query(`select *, (power(company_lat - ${coords.pos.lat},2) + power(company_long - ${coords.pos.lng},2)) as "dist" from users where "dist" <= ${thresh} order by dist desc`,{
                //     type: QueryTypes.SELECT
                // })

                // return res.status(200).json({
                //     query_near: validated.near,
                //     results: restaurants
                // });
            }

            return res.status(200).send({
                message: "Berhasil mendapatkan semua restoran",
                restaurants
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * controller untuk Get restaurant
     * @author CBEngineer
     */
    async getRestaurant(req,res) {
        // validate id restaurant
        const restaurant = await Restaurant.findByPk(req.params.id)
        if (!restaurant) {
            throw new NotFoundError("ID Restaurant tidak ditemukan",{
                id: req.params.id
            })
        }

        return res.status(200).json({
            message: "Berhasil mendapatkan restaurant",
            restaurant: {
                restaurant_id: req.params.id,
                restaurant_name: restaurant.restaurant_name,
                restaurant_cuisine: restaurant.restaurant_cuisine,
                restaurant_contact_person: restaurant.restaurant_contact_person,
                restaurant_address: restaurant.restaurant_address,
                restaurant_lat: restaurant.restaurant_lat,
                restaurant_lng: restaurant.restaurant_lng,
            }
        })
    }

    getCuisine(req,res){
        // TODO
    }


}

module.exports = new SeekerController();