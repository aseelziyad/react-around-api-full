const express = require("express");
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const auth = require("../middleware/auth");

const router = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

router.get("/", auth, getCards);

router.post(
  "/",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL),
    }),
  }),
  createCard,
);

router.delete(
  "/:cardId",
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex(),
    }),
  }),
  deleteCard,
);

router.put(
  "/:cardId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  }),
  likeCard,
);

router.delete(
  "/:cardId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
