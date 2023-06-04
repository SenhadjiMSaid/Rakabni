const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/activate/:id", authController.activateUser);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

router
  .route("/updateMyPassword")
  .patch(authController.protect, authController.updatePassword);

  

router
  .route("/updateMe")
  .patch(
    authController.protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  );

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router
  .route("/:conducteurId/reviews")
  .post(authController.protect, reviewController.createReview);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/").get(userController.getAllUsers);

router.route("/annuler").post(userController.emailtrajetannule);
router.route("/ban/:id").patch(userController.banUser);
module.exports = router;
