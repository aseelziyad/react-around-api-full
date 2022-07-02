// export const BASE_URL = "https://register.nomoreparties.co";
export const BASE_URL = "http://localhost/3000";

const getRespose = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
};

export const register = (user) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "mode": "cors",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ email: user.email, password: user.password }),
  }).then(getRespose);
};

export const authorize = (user) => {
  console.log(BASE_URL);
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ email: user.email, password: user.password }),
  })
    .then(getRespose)
    .then((res) => {
      if (res.token) {
        localStorage.setItem("jwt", res.token);
        localStorage.setItem("email", user.email);
        return res;
      } else {
        return;
      }
    });
};

export const checkToken = (token) => {
  if (token) {
    return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(getRespose);
  }
};
