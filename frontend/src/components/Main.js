import React from "react";
import Card from "./Card";
import { CurrentUserState } from "../contexts/CurrentUserContext";

export default function Main(props) {
  const currentUser = React.useContext(CurrentUserState);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <button
            type="button"
            aria-label="Edit avatar"
            className="profile__avatar-button"
            onClick={props.onEditAvatarClick}
          ></button>
          <img
            src={currentUser.avatar}
            className="profile__avatar"
            alt="Avatar"
          />
        </div>

        <div className="profile__info">
          <div className="profile__info-container">
            <h1 className="profile__title">{currentUser.name}</h1>
            <button
              type="button"
              aria-label="Edit"
              className="profile__edit-button"
              onClick={props.onEditProfileClick}
            ></button>
          </div>
          <p className="profile__subtitle">{currentUser.about}</p>
        </div>
        <button
          type="button"
          aria-label="Add"
          className="profile__add-button"
          onClick={props.onAddPlaceClick}
        ></button>
      </section>
      <section className="photographs">
        {props.cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onDeleteClick={props.onDeleteClick}
            onCardLike={props.onCardLike}
          />
        ))}
      </section>
    </main>
  );
}
