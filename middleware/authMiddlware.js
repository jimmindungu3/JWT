const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const myJwtSecret = process.env.JWTSECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if jwt exist and is valid
  if (token) {
    jwt.verify(token, myJwtSecret, (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check user for display in header
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, myJwtSecret, async (err, decodedToken) => {
      if (err) {
        next();
      } else {
        const user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
