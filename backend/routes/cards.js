const express = require("express");
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

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

router.get("/", getCards);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().custom(validateURL),
    }),
  }),
  createCard,
);

router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  deleteCard,
);

router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  likeCard,
);

router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
