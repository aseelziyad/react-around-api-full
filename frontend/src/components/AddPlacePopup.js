import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useState } from "react";

export default function AddPlacePopup(props) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  React.useEffect(() => {
    setName("");
    setLink("");
  }, [props.isOpen]);

  function handleNameChange(event) {
    setName(event.target.value);
  }
  function handleLinkChange(event) {
    setLink(event.target.value);
  }
  function handleSubmit(evt) {
    evt.preventDefault();
    props.onAddPlaceSubmit({
      name: name,
      link: link,
    });
  }

  return (
    <PopupWithForm
      name="addcard"
      title="New place"
      buttonText={props.buttonText}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      novalidate
    >
      <input
        type="text"
        className="popup__input popup__input_type_add-card"
        name="name"
        id="input-title"
        placeholder="Place Title"
        minLength="1"
        maxLength="30"
        required
        value={name}
        onChange={handleNameChange}
      />
      <span id="input-title-error" className="popup__error"></span>
      <input
        type="url"
        className="popup__input popup__input_type_add-card"
        name="link"
        id="input-image-link"
        placeholder="Image Link"
        required
        value={link}
        onChange={handleLinkChange}
      />
      <span id="input-image-link-error" className="popup__error"></span>
    </PopupWithForm>
  );
}
