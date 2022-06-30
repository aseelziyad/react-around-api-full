import success from "../images/true.png";
import fail from "../images/false.png";

export default function InfoTooltip(props) {
    return (
      <div className={`popup popup_${props.name} ${props.isOpen ? "popup_active" : ""}`}>
        <div className="popup__box">
          <button
            type="button"
            className="popup__close"
            onClick={props.onClose}
          ></button>
          <img
            className="popup__sign-image"
            src={props.status === false ? fail : success}
            alt="login logo status"
          />
          <h2 className="popup__sign-message">
            {props.status === false
              ? "Oops, something went wrong! Please try again"
              : "Success! You have now been registered"}
          </h2>
        </div>
      </div>
    );
}
