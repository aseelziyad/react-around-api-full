/* eslint-disable new-cap */
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
const errorHandler = require("./errors/errorHandler");
const centralErrorHandler = require("./errors/centralErrorHandler");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use(requestLogger);
app.use(express.json());

app.use(cors());
app.options("*", cors()); //  enable requests for all routes

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(6),
      name: Joi.string().min(2),
      about: Joi.string().min(2),
      avatar: Joi.string().min(2),
    }),
  }),
  createUser,
);
app.use(errors());
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.get("*", () => {
  throw new errorHandler();
});

app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
