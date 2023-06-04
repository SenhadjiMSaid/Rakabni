const Review = require("./../models/reviewModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

exports.setConducteurUserIds = (req, res, next) => {
  //allow neseted routes
  if (!req.body.conducteur) req.body.conducteur = req.params.conducteurId; //he can write the id of tour manualy or not if not we bring it from the req.params.tourId
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.conducteur) req.body.conducteur = req.params.conducteurId; //pour utiliser url direct pour cree
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.getReviewsofuser = catchAsync(async (req, res, next) => {
  const review = await Review.find({
    conducteur: req.params.id,
  });

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});
