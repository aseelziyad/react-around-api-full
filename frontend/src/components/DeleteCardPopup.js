import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function DeleteCardPopup(props) {
  function handleSubmit(event) {
    event.preventDefault();
    props.onDeleteCardSubmit(props.card);
  }

  return (
    <PopupWithForm
      name="delete"
      title="Are you sure"
      buttonText={props.buttonText}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      novalidate
    ></PopupWithForm>
  );
}
