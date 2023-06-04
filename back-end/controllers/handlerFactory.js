const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Trajet = require("../models/trajetModel");
const Review = require("../models/reviewModel");
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.params.id;

    await Review.deleteMany({ conducteur: userId });

    await Review.deleteMany({ user: userId });

    await Trajet.deleteMany({ Conducteur: userId });

    const doc = await Model.findByIdAndDelete(userId);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        Model: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    await Model.populate(doc, {
      path: "Conducteur",
      select: "name photo slug ranking phone ratingsAverage active email Sexe",
    });
    await Model.populate(doc, {
      path: "Passagers",
      select: "name photo",
    });
    await Model.populate(doc, {
      path: "reviews",
      populate: {
        path: "user",
        select: "name photo",
      },
    });

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
