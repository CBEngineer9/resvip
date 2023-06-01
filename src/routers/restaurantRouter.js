const { Router } = require("express");
const RestaurantReservationController = require("../controllers/RestaurantReservationController");
const { RestaurantMiddleware } = require("../middlewares/RoleMiddleware");

const restaurantRouter = Router();

restaurantRouter.get("/reservation", RestaurantMiddleware, RestaurantReservationController.getAllReservation)
restaurantRouter.get("/reservation/:reservation_id", RestaurantMiddleware, RestaurantReservationController.getReservationById)

module.exports = restaurantRouter;