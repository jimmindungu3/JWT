const jwt = require("jsonwebtoken");
require("dotenv").config();

const myJwtSecret = process.env.JWTSECRET;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if jwt exist and is valid
  if (token) {
    jwt.verify(token, myJwtSecret, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
