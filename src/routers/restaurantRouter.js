const { Router } = require("express");
const RestaurantReservationController = require("../controllers/RestaurantReservationController");

const restaurantRouter = Router();

restaurantRouter.get("/reservation",RestaurantReservationController.getAllReservation)
restaurantRouter.get("/reservation/:reservation_id",RestaurantReservationController.getReservationById)

module.exports = restaurantRouter;