const Card = require("../models/card");
const { ForbiddenError } = require("../errors/errorHandler");
const { NotFoundError } = require("../errors/errorHandler");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: "Internal Server Error" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;
  console.log(owner);
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(400).send({ message: "Your request resulted an error" });
      } else {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const deleteCard = (req, res) => {
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
      if (err.statusCode === 400) {
        res.send({ message: "Your request  resulted an error" });
      } else if (err.statusCode === 404) {
        res.send({ message: "Card not found" });
      } else if (err.statusCode === 403) {
        res.send({ message: "Unauthriozed Error" });
      } else {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.send({ message: "Your request  resulted an error" });
      } else if (err.statusCode === 404) {
        res.send({ message: "Card not found" });
      } else if (err.statusCode === 403) {
        res.send({ message: "Unauthriozed Error" });
      } else {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.send({ message: "Your request  resulted an error" });
      } else if (err.statusCode === 404) {
        res.send({ message: "Card not found" });
      } else if (err.statusCode === 403) {
        res.send({ message: "Unauthriozed Error" });
      } else {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
