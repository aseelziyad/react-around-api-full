/* eslint-disable no-const-assign */
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/errorHandler");
// eslint-disable-next-line no-unused-vars
const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  // getting authorization from the header
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }
  // getting token from authr with replacing bearer prefix
  const token = authorization.replace("Bearer ", "");
  console.log(token);
  let payload;
  try {
    // verifying user token if its the same as sent earlier
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    );
  } catch (err) {
    console.log(err);
    throw new UnauthorizedError();
  }
  console.log(payload);
  // assiging payload to the req obj
  req.user = payload;

  next(); // sending req to nxt middleware
};

module.exports = auth;
