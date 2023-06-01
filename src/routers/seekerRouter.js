const { Router } = require("express");
const SeekerController = require("../controllers/SeekerController");
const SeekerReservationController = require("../controllers/SeekerReservationController");

const seekerRouter = Router();

seekerRouter.get("/",SeekerController.getRestaurant)

//reservations
seekerRouter.post('/reservation', SeekerReservationController.addReservation)
seekerRouter.put('/reservation/:reservation_id', SeekerReservationController.rescheduleReservation)
seekerRouter.delete('/reservation/:reservation_id', SeekerReservationController.cancelReservation)
seekerRouter.get('/reservation', SeekerReservationController.getHistoryReservation)
seekerRouter.get('/reservation/:reservation_id', SeekerReservationController.getReservationById)

module.exports = seekerRouter;