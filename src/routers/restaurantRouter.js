const { Router } = require("express");
const RestaurantReservationController = require("../controllers/RestaurantReservationController");
const { RestaurantMiddleware } = require("../middlewares/RoleMiddleware");

const restaurantRouter = Router();

// slots
restaurantRouter.post('/slot',RestaurantMiddleware, RestaurantReservationController.insertSlot)
restaurantRouter.put('/slot/:id',RestaurantMiddleware, RestaurantReservationController.updateSlot)
restaurantRouter.delete('/slot/:id',RestaurantMiddleware, RestaurantReservationController.deleteSlot)

restaurantRouter.get("/reservation", RestaurantMiddleware, RestaurantReservationController.getAllReservation)
restaurantRouter.get("/reservation/:reservation_id", RestaurantMiddleware, RestaurantReservationController.getReservationById)

// update reservation (acc/reject)
restaurantRouter.put("/reservation/:reservation_id", RestaurantMiddleware, RestaurantReservationController.updateReservation)

// table
restaurantRouter.post("/table", RestaurantMiddleware, RestaurantReservationController.insertTable);
restaurantRouter.get("/table", RestaurantMiddleware, RestaurantReservationController.getAllTables);

module.exports = restaurantRouter;