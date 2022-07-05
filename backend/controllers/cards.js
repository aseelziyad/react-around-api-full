const Card = require("../models/card");
const { ForbiddenError } = require("../errors/errorHandler");
const { NotFoundError } = require("../errors/errorHandler");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }
      return Card.findOneAndDelete(req.params.cardId);
    })
    .then((deleteCard) => {
      res.send({ data: deleteCard });
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
