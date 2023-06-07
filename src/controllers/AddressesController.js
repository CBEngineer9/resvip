const HereAPIService = require("../services/HereAPIService");
const ExpressController = require("./_ExpressController");

class AddressessController extends ExpressController {
    /**
     * Controller untuk get valid address dari hereAPI
     * @author CBEngineer
     */
    async getValidAddresses(req, res, next) {
        const validator = Joi.object({
            query: Joi.string().required()
        })

        try {
            const validated = await validator.validateAsync(req.body)
            const addresses = await HereAPIService.getAddresses(validated.query)

            return res.status(200).send({
                addresses,
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new TestController();