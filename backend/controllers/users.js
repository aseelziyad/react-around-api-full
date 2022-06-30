const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/errorHandler");

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      res.send(user);
    })
    .catch(next);
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: "Internal Server Error" });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((userId) => {
      res.status(200).send({ data: userId });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Your request  resulted an error" });
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: "User not found" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash, // adding the hash to the database
        name,
        about,
        avatar,
      })
    )
    .then((user) => {
      res.status(200).send({ _id: user._id });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Your request resulted an error" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  //authentication successful! user is in the user variable
  User.findUserByCredentails(email, password)
    .then((user) =>
      res.json({
        //creating the token
        token: jwt.sign(
          {
            _id: user._id,
          },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          }
        ),
      })
    )
    .catch(next);
}

const updateUser = (req, res) => {
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
        res.status(404).send({ message: "User not found" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Your request  resulted an error" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Your request  resulted an error" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
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
