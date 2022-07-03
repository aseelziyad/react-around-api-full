import React from "react";

class Api extends React.Component {
  constructor(props) {
    super(props);
    this._baseUrl = props.baseUrl;
    this._headers = props.headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._getResponseData);
  }
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._getResponseData);
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me `, {
      headers: this._headers,
      method: "PATCH",

      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._getResponseData);
  }

  createCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify(data),
    }).then(this._getResponseData);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: "DELETE",
    }).then(this._getResponseData);
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/likes/${id}`, {
        headers: this._headers,
        method: "PUT",
      }).then(this._getResponseData);
    } else {
      return fetch(`${this._baseUrl}/cards/likes/${id}`, {
        headers: this._headers,
        method: "DELETE",
      }).then(this._getResponseData);
    }
  }

  setUserAvatar(imageLink) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({ avatar: imageLink }),
    }).then(this._getResponseData);
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return res.json();
  }
}

const jwt = localStorage.getItem("jwt");
const api = new Api({
  baseUrl: "https://api.aseelziyad.students.nomoreparties.sbs",
  headers: {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
