export default function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_${props.name} ${
        props.isOpen ? "popup_active" : ""
      }`}
    >
      <div className="popup__box">
        <button
          type="button"
          aria-label="Close popup"
          className="popup__close"
          onClick={props.onClose}
        ></button>
        <h2 className="popup__title">{props.title}</h2>
        <form
          onSubmit={props.onSubmit}
          className={`popup__form popup__form_type${props.name}`}
          name={props.name}
        >
          {props.children}
          <button type="submit" className="popup__submit-btn">
            {`${props.buttonText}`}
          </button>
        </form>
      </div>
    </div>
  );
}
