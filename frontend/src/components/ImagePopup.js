export default function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_image ${card && "popup_active"}`}>
      <div className="popup__image">
        <button
          type="button"
          aria-label="Close popup"
          className="popup__close"
          onClick={onClose}
        ></button>
        <img
          className="popup__image-card"
          src={card ? card.link : ""}
          alt={card ? card.name : ""}
        />
        <h2 className="popup__image-title">{card ? card.name : ""}</h2>
      </div>
    </div>
  );
}
