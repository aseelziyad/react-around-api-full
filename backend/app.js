const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const cors = require("cors");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { requestLogger, errorLogger } = require("./middleware/logger");
const { login, createUser } = require("./controllers/users");
const auth = require("./middleware/auth");
const centralErrorHandler = require("./errors/centralErrorHandler");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/aroundb");
const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(errors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);
app.post("/signin", auth, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post(
  "/signup",
  auth,
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
app.use(errorLogger);
app.get("*", (req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});
app.use((err, req, res, next) => {
  centralErrorHandler(err, res);
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
