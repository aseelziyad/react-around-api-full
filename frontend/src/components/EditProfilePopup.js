import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserState } from "../contexts/CurrentUserContext";
import { useState } from "react";

export default function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleSubmit(evet) {
    evet.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      name="profile"
      title=" Edit profile"
      buttonText={props.buttonText}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      novalidate
    >
      <input
        type="text"
        className="popup__input"
        name="name"
        id="input-name"
        placeholder="Full Name"
        minLength="2"
        maxLength="40"
        required
        value={name || ""}
        onChange={handleNameChange}
      />
      <span id="input-name-error" className="popup__error"></span>
      <input
        type="text"
        className="popup__input"
        name="about"
        id="input-about"
        placeholder="About me"
        minLength="2"
        maxLength="200"
        required
        value={description || ""}
        onChange={handleDescriptionChange}
      />
      <span id="input-about-error" className="popup__error"></span>
    </PopupWithForm>
  );
}
