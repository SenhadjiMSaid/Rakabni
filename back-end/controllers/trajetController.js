const Trajet = require("./../models/trajetModel.js");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.setTrajetUserIds = (req, res, next) => {
  //allow neseted routes
  if (!req.body.tour) req.body.tour = req.params.tourId; //he can write the id of tour manualy or not if not we bring it from the req.params.tourId
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllTrajets = factory.getAll(Trajet);
exports.updateTrajet = factory.updateOne(Trajet);
exports.deleteTrajet = factory.deleteOne(Trajet);
exports.createTrajet = factory.createOne(Trajet);

exports.getTrajet = catchAsync(async (req, res, next) => {
  const trajet = await Trajet.findById({
    _id: req.params.id,
    isActive: true,
  })
    .populate({
      path: "Conducteur",
      select: "name photo pseudo ratingsAverage phone",
    })
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name photo pseudo ratingAverage",
      },
    })
    .populate({
      path: "Passagers",
      select: "name photo pseudo email",
    });

  res.status(200).json({
    //to resive tours const array
    status: "success",
    data: {
      trajet,
    },
  });
});

exports.getUserTrajects = catchAsync(async (req, res, next) => {
  const trajet = await Trajet.find({
    slug: req.params.slug,
  }).populate({
    path: "Passagers",
    select: "name photo slug email",
  });

  res.status(200).json({
    //to resive tours const array
    status: "success",
    data: {
      trajet,
    },
  });
});
exports.getUserReservations = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const trajet = await Trajet.find({ Passagers: id })
    .populate("Passagers")
    .populate("Conducteur", "name photo ratingsAverage phone ")
    .populate("reviews");
  res.status(200).json({
    //to resive tours const array
    status: "success",
    data: {
      trajet,
    },
  });
});

exports.searchTrajets = catchAsync(async (req, res, next) => {
  const { Depart, Arrivée, date, places } = req.query;

  // create filter object
  const filter = {
    Depart: { $regex: Depart, $options: "i" },
    Arrivée: { $regex: Arrivée, $options: "i" },
    places: { $gte: places },
  };

  // add date filter if date is provided
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    filter.date = { $gte: startDate, $lt: endDate };
  }

  // execute the query
  const features = new APIFeatures(Trajet.find(filter), req.query)
    .sort()
    .limitFields()
    .paginate();

  const trajets = await features.query;

  if (!trajets.length) {
    return next(new AppError("Aucun trajet trouver", 404));
  }

  // populate user information for each trajet
  await Trajet.populate(trajets, {
    path: "Conducteur",
    select: "name photo",
  });

  // send response
  res.status(200).json({
    status: "success",
    results: trajets.length,
    data: {
      trajets,
    },
  });
});

exports.reserverTrajet = catchAsync(async (req, res, next) => {
  const trajet = await Trajet.findById(req.params.id);
  const placesDisponibles = trajet.places;

  if (req.body.places > placesDisponibles) {
    return res.status(400).json({
      status: "fail",
      message:
        "Désolé, il n'y a pas suffisamment de places disponibles pour ce trajet",
    });
  }

  const updatedTrajet = await Trajet.findByIdAndUpdate(
    req.params.id,
    {
      $push: { Passagers: req.body.passagerId },
      $inc: { places: -req.body.places },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      trajet: updatedTrajet,
    },
  });
});
