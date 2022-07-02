/* eslint-disable function-call-argument-newline */
/* eslint-disable indent */
/* eslint-disable function-paren-newline */
/* eslint-disable no-unused-vars */
const express = require("express");
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const auth = require("../middleware/auth");

const router = express.Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

router.get("/", auth, getUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:userId", auth, getUserById);
// router.post("/", createUser); no longer needed
router.patch("/me", auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
  }),
}),
  updateUser,
);
router.patch(
  "/me/avatar", auth, celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  updateAvatar,
);

module.exports = router;
