const Card = require("../models/card");
const { ForbiddenError } = require("../errors/errorHandler");

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
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Your request resulted an error" });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;

  Card.findById(id)
  orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }
      return Card.findByIdAndDelete(id).orFail();
    })
    .then((card) => res.send(card))
    .catch(next);
  // Card.findByIdAndRemove(req.params.cardId)
  //   .orFail()
  //   .then((card) => {
  //     res.status(200).send({ data: card });
  //   })
  //   .catch((err) => {
  //     if (err.name === "CastError") {
  //       res.status(400).send({ message: "NotValid Data" });
  //     }
  //     if (err.name === "DocumentNotFoundError") {
  //       res.status(404).send({ message: "User not found" });
  //     } else {
  //       res.status(500).send({ message: "An error has occurred on the server" });
  //     }
  //   });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Your request  resulted an error" });
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: "Card not found" });
      } else {
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
      if (err.name === "CastError") {
        res.status(400).send({ message: "Your request  resulted an error" });
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: "Card not found" });
      } else {
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
