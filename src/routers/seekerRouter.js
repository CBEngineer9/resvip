const { Router } = require("express");
const SeekerController = require("../controllers/SeekerController");

const seekerRouter = Router();

seekerRouter.get("/",SeekerController.getRestaurant)

module.exports = seekerRouter;