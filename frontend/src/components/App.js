import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Route, Routes, Navigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import { register, authorize, checkToken } from "../utils/auth";
import { CurrentUserState } from "../contexts/CurrentUserContext";

export default function App() {
  const [isEditrofilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [editProfileButton, setEditProfileButton] = useState("Save");
  const [editAvatarButton, setEditAvatarButton] = useState("Save");
  const [addPlaceButton, setAddPlaceButton] = useState("Save");
  const [deleteCardButton, setDeleteCardButton] = useState("Yes");
  const [selectedCard, setSelectCard] = useState(null);
  const [deleteCard, setDeleteCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [values, setValues] = React.useState({ email: "", password: "" });
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const navigate = useNavigate();

    function handleLogin({ email, password }) {
      authorize({ email, password })
        .then((user) => {
          if (user) {
            localStorage.setItem("jwt", user.token);
            setLoggedIn(true);
            setValues(email);
            navigate("/");
          } else {
            setIsInfoToolTipOpen(true);
            throw new Error("No token recieved");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function handleRegister({ email, password }) {
      register({ email, password })
        .then((user) => {
          navigate("./signin");
          setIsRegistered(true);
          setIsInfoToolTipOpen(true);
        })
        .catch((err) => {
          setIsRegistered(false);
        })
        .finally(() => {
         setIsInfoToolTipOpen(true);
      })
    }

    useEffect(() => {
      const token = localStorage.getItem("jwt");
      token &&
        checkToken(token)
          .then((res) => {
            setValues(res.data.email);
            setLoggedIn(true);
            navigate("/");
          })
          .catch((err) => {
            console.log(err);
          });
    }, []);

  function handleEditProfileClick() {
    setEditProfileButton("Save");
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarButton("Save");
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlaceButton("Save");
    setIsAddPlacePopupOpen(true);
  }

  function handleDeleteClick(data) {
    setDeleteCardButton("Yes");
    setIsDeletePopupOpen(true);
    setDeleteCard(data);
  }

  function handleCardClick(data) {
    setSelectCard(data);
  }

  function handleUpdateUser(data) {
    setEditProfileButton("Saving...");
    api
      .setUserInfo(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    setEditAvatarButton("Saving...");
    api
      .setUserAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(data) {
    setAddPlaceButton("Saving...");
    api
      .createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    api
      .getUserInfo()
      .then((data) => setCurrentUser(data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((data) => {
        setCards((cards) => [...cards, ...data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    setDeleteCardButton("Deleting...");
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((data) => data._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogOut(event) {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setValues("")
    navigate("/signin")
  }
  
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectCard(null);
    setIsInfoToolTipOpen(false);
  }

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  return (
    <div className="page">
      <CurrentUserState.Provider value={currentUser}>
        <Header loggedIn={loggedIn} handleLogOut={handleLogOut} user={values} />
        <InfoTooltip
          name={"sign"}
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={isRegistered}
        />
        <EditProfilePopup
          isOpen={isEditrofilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          buttonText={editProfileButton}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          buttonText={editAvatarButton}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          buttonText={addPlaceButton}
        />
        <DeleteCardPopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onDeleteCardSubmit={handleCardDelete}
          buttonText={deleteCardButton}
          card={deleteCard}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <Routes>
          <Route
            path="/signin"
            element={<Login onSubmit={handleLogin} loggedIn />}
          />
          <Route
            path="/signup"
            element={<Register onSubmit={handleRegister} loggedIn />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  onEditProfileClick={handleEditProfileClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onDeleteClick={handleDeleteClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  cards={cards}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </CurrentUserState.Provider>
    </div>
  );
}
