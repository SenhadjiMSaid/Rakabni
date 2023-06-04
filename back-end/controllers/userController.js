const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModel.js");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const { path } = require("../app.js");
const Email = require("../utils/email");
const AppError = require("../utils/appError");

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, { path: "reviews" });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`back-end/public/img/user/${req.file.filename}`);

  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "pseudo",
    "phone",
    "Sexe"
  );
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.emailtrajetannule = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }
    await new Email(user).Trajetannuler();
    res.status(200).json({
      status: "success",
      message: "sent to email!",
    });
  } catch (err) {}
  return next(
    new AppError("There was an error sending the email. Try again later!"),
    500
  );
});
exports.banUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("Utilisateur introuvable.", 404));
  }

  if (user.active == true) {
    user.active = false;
  } else {
    user.active = true;
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Utilisateur banni avec succès.",
  });
});
