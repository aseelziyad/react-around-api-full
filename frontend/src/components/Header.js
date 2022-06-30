import React from "react";
import logo from "../images/header-logo.svg";
import { Link, useLocation } from "react-router-dom";

export default function Header(props) {
  const { loggedIn, handleLogOut } = props;
  const location = useLocation();
  return loggedIn ? (
    <header className="header">
      <img className="header__logo" src={logo} alt="Around the U.S" />
      <p className="header__menu">{props.user}</p>
      <Link to={"/signin"} className="header__link" onClick={handleLogOut}>
        {"Log out"}
      </Link>
    </header>
  ) : (
    <header className="header">
      <img className="header__logo" src={logo} alt="Around the U.S" />
      <Link
        to={location.pathname === "/signin" ? "/signup" : "/signin"}
        className={`header__link`}
        onClick={loggedIn && handleLogOut}
      >
        {location.pathname === "/signin" ? "Sign up" : "Log In"}
      </Link>
    </header>
  );
}