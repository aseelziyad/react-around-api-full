/* eslint-disable implicit-arrow-linebreak */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { UnauthorizedError, NotFoundError } = require("../errors/errorHandler");

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new NotFoundError();
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  console.log(req.params);
  User.findById(req.params.userId)
    .orFail()
    .then((userId) => {
      res.send({ data: userId });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash, // adding the hash to the database
        name,
        about,
        avatar,
      }))
    .then((user) => {
      res.send({ _id: user._id });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // authentication successful! user is in the user variable
  User.findByCredentails(email, password)
    .then((user) =>
      res.json({
        // creating the token
        token: jwt.sign(
          {
            _id: user._id,
          },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          },
        ),
      }))
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError();
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
