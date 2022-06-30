import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = (props) => {
    const { onSubmit } = props;
    const [values, setValues] = useState({});

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ email: values.email, password: values.password });
    }

    return (
      <div className="sign">
        <h2 className="sign__title">Sign Up</h2>
        <form className="sign__form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="sign__input"
            name="email"
            id="input-email"
            placeholder="Email"
            value={values.email || ""}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="sign__input"
            name="password"
            id="input-password"
            placeholder="Password"
            value={values.password || ""}
            onChange={handleChange}
            required
          />
          <button className="sign__button" type="submit">
            Sign Up
          </button>
        </form>
        <Link to="/signin" className="sign__link">
          Already a member? Sign in here! pew pew
        </Link>
      </div>
    );
}

export default Register;