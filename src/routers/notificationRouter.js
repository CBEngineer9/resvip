const { Router } = require("express");
const SeekerController = require("../controllers/SeekerController");
const SeekerReservationController = require("../controllers/SeekerReservationController");
const { SeekerMiddleware } = require("../middlewares/RoleMiddleware");

const seekerRouter = Router();

//down payment
notificationRouter.post('/', SeekerReservationController.notifyPayment);

module.exports = seekerRouter;