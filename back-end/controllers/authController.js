const crypto = require("crypto");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions); // for security to not brawser modif the cookie hehe chui trop fort ;

  //to not show password when we create new user
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    date: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `http://localhost:8000/api/v1/users/activate/${newUser.id}`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //1) check if email and pass exist
  if (!email || !password) {
    return next(new AppError("Please provide mail ajd password!", 400)); //always return
  }

  //2) chesk if user existes && password is correct
  const user = await User.findOne({ email: email, active: true }).select(
    "+password"
  ); //+password because password fdont apire in db

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  //3) tt ok send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1) get token chck if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //becuse it a array with brarer + password so we need juste the password
  }
  // console.log(token);
  //a voir apres si c utile dernier section
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
    return next(
      new AppError("You are not logged in please log in to fet access.", 401)
    );
  }

  //2) validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  //3) check if the user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user of this token does no longer exist  ", 401)
    );
  }

  //4) Check if user changed password after the JWT was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password , please try again", 401)
    );
  }

  //grant acess to protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      url: resetURL,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1 get user based on the toke
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2 if toke hase not expired, and therre is user , set the new password
  if (!user) {
    return next(new AppError("TOKEN is invalid or expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3 update chagedPasswordat property for the user

  //4 log the user in send JWT

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.verifyPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("The current password is incorrect", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  //4 log user in send JWT
  createSendToken(user, 200, res);
});

//only for rendered pages no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //1 verif token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //2) check if the user exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //3) Check if user changed password after the JWT was issued

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //there is a logged in user
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
exports.getCurrentUser = (req, res, next) => {
  // accéder à l'utilisateur connecté via res.locals.user
  const currentUser = res.locals.user;

  // envoyer l'utilisateur connecté en réponse sous forme de JSON
  res.status(200).json({
    status: "success",
    data: {
      user: currentUser,
    },
  });
};

exports.getCurrentUser = (req, res, next) => {
  // accéder à l'utilisateur connecté via res.locals.user
  const currentUser = res.locals.user;

  // envoyer l'utilisateur connecté en réponse sous forme de JSON
  res.status(200).json({
    status: "success",
    data: {
      user: currentUser,
    },
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.activateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  // Recherchez l'utilisateur dans la base de données
  const user = await User.findById({ _id: userId });

  // Vérifiez si l'utilisateur existe
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Vérifiez si l'utilisateur est déjà activé
  if (user.active) {
    return next(new AppError("User is already activated", 400));
  }

  // Activez l'utilisateur
  user.active = true;
  await user.save();

  // Redirigez l'utilisateur vers une page de succès ou renvoyez une réponse JSON réussie

  res.status(200).json({
    status: "success",
    message: "User activated successfully",
  });
});
