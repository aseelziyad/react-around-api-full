// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const cors = require("cors");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { login, createUser } = require("./controllers/users");
const auth = require("./middleware/auth");
const ErrorHandler = require("./errors/errorHandler");
const centralErrorHandler = require("./errors/centralErrorHandler");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(requestLogger);
app.use(express.json());

// include these before other routes
app.use(cors());
app.options("*", cors()); //  enable requests for all routes

// app.use((req, res, next) => {
//   req.user = {
//     _id: "629363394c144120b4927f51",
//   };

//   next();
// });

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser,
);
app.use(errors());
app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);
app.get("*", () => {
  throw new ErrorHandler();
});
app.use(errorLogger);
// app.get("/", (req, res) => {
//   res.status(404).send({ message: "The requested resource was not found" });
// });
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
  // if (err.statusCode === undefined) {
  //   const { statusCode = 500, message } = err;
  //   res.status(statusCode).send({
  //     message: statusCode === 500 ? "An error occured on the server" : message,
  //   });
  //   return;
  // }
  // res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
