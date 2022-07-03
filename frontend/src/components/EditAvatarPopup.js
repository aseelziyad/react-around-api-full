import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const avatarRef = React.useRef("");

  function handleSubmit(event) {
    event.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Change profile picture"
      buttonText={props.buttonText}
      isOpen={props.isOpen}
      onClose={props.onClose}
      novalidate
      onSubmit={handleSubmit}
    >
      <input
        type="url"
        className="popup__input"
        name="avatarImage"
        id="input-avatar"
        placeholder="Image link"
        required
        ref={avatarRef}
      />
      <span id="input-avatar-error" className="popup__error"></span>
    </PopupWithForm>
  );
}
