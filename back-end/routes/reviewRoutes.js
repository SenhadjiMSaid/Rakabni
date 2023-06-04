const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.setConducteurUserIds, reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReviewsofuser)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;