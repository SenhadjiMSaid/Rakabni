const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const trajetRouter = require("./routes/trajetRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" })); //read data into res.body
app.use(express.urlencoded({ extended: true, limit: "10kb" })); //
app.use(cookieParser()); //

//teste middleware
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public/css")));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/trajets", trajetRouter);
app.use("/api/v1/reviews", reviewRouter);

app.get("/", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "index.html");
  res.sendFile(filePath);
});
app.get("/login", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "login.html");
  res.sendFile(filePath);
});
app.get("/signup", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "signup.html");
  res.sendFile(filePath);
});
app.get("/recherche", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "rech.html");
  res.sendFile(filePath);
});
app.get("/publier", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "addTrip.html");
  res.sendFile(filePath);
});
app.get("/details", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "details.html");
  res.sendFile(filePath);
});
app.get("/confirmEmail", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "confirmEmail.html");
  res.sendFile(filePath);
});
app.get("/resetPassword", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "resetPassword.html");
  res.sendFile(filePath);
});
app.get("/admin", function (req, res) {
  const filePath = path.join(__dirname, "public", "html", "admin.html");
  res.sendFile(filePath);
});
// if we cherche /API/mehdii ou qlq chose qui nexiste pas on vous donne une err vadalnle poour comprendre
// app.all("*", (req, res, next) => {
//   next(new AppError(`cant find ${req.originalUrl} on this serv`, 404));
// });
// app.use(globalErrorHandler);

module.exports = app;
