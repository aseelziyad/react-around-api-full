import React from "react";
import { CurrentUserState } from "../contexts/CurrentUserContext";

export default function Card({ card, onCardClick, onDeleteClick, onCardLike }) {
  const currentUser = React.useContext(CurrentUserState);

  function handleImageClick() {
    onCardClick(card);
  }

  function handleDeleteClick() {
    onDeleteClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }
  const isOwn = card.owner === currentUser._id;
  
    const cardDeleteButtonClassName = `photograph__delete-button ${
      isOwn ? "" : "photograph__delete-button_hidden"
    }`;

  const isLiked = card.likes.some((user_id) => user_id === currentUser._id);
  
    const cardLikeButtonClassName = `photograph__like-button ${
      isLiked ? "photograph__like-button_active" : "photograph__like-button"
    }`;
  
  return (
    <div className="photograph">
      <button
        type="button"
        aria-label="delete"
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>
      <img
        className="photograph__post"
        src={card.link}
        alt={card.name}
        onClick={handleImageClick}
      />
      <div className="photograph__container">
        <h2 className="photograph__title">{card.name}</h2>
        <div className="photograph__container-like">
          <button
            type="button"
            aria-label="Like"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <p className="photograph__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </div>
  );
}
