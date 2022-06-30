const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("Validator");
const { UnauthorizedError } = require("../errors/errorHandler");

const defaultUser = {
  name: "BoJack Horseman",
  about: "Horse",
  avatar: "https://uploads-ssl.webflow.com/5fa452663d18a6699f11aa07/61f015590e1c6fadfd5f5906_Podcast%20Main%20Images.jpg"
};

const userSchema = new mongoose.Schema({
  email: {
     type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      }
    }
  },
   password: {
      type: String,
    required: true,
     unique: true,
     select: false,
    minlength: 6,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
  avatar: {
    type: String,
    // validate: {
    //   validator(v) {
    //     return /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gim.test(v);
    //   },
    // },
      validate: {
      validator(v) {
        return validator.isURL(v);
      }
    },
    required: true,
  },
});

userSchema.statics.findUserByCredentails = function (email, password) {
  //find the user by email
  return this.findOne({ email })
    .select("+pasword")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError();
      }
      // compare hashes
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError();
          }
          return user;
      })
  })
}

module.exports = mongoose.model("user", userSchema);
