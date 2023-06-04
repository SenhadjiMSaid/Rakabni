const express = require("express");
const trajetController = require("./../controllers/trajetController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(trajetController.getAllTrajets)
  .post(authController.isLoggedIn, trajetController.createTrajet);

router
  .route("/:id")
  .get(trajetController.getTrajet)
  .patch(trajetController.updateTrajet)
  .delete(trajetController.deleteTrajet);

router.route("/conducteur/:slug").get(trajetController.getUserTrajects);
router.route("/passager/:id").get(trajetController.getUserReservations);
router.route("/reserver/:id").post(trajetController.reserverTrajet);

module.exports = router;
