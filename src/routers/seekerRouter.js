const { Router } = require("express");
const SeekerController = require("../controllers/SeekerController");
const SeekerReservationController = require("../controllers/SeekerReservationController");
const { SeekerMiddleware } = require("../middlewares/RoleMiddleware");

const seekerRouter = Router();

seekerRouter.get("/", SeekerMiddleware, SeekerController.getRestaurant)

//reservations
seekerRouter.post('/reservation', SeekerMiddleware, SeekerReservationController.addReservation)
seekerRouter.put('/reservation/:reservation_id', SeekerMiddleware, SeekerReservationController.rescheduleReservation)
seekerRouter.delete('/reservation/:reservation_id', SeekerMiddleware, SeekerReservationController.cancelReservation)
seekerRouter.get('/reservation', SeekerMiddleware, SeekerReservationController.getHistoryReservation)
seekerRouter.get('/reservation/:reservation_id', SeekerMiddleware, SeekerReservationController.getReservationById)

module.exports = seekerRouter;