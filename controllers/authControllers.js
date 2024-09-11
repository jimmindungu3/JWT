const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const myJwtSecret = process.env.JWTSECRET;
const maxAge = 3 * 24 * 60 * 60; // maxAge of 3 days in seconds
// Handle errors that occur during user operations
const handleErrors = (err) => {
  // Initialize an object to store other specific error messages
  let errors = { email: "", password: "" };

  // handle login errors
  if (err.message === "Incorrect email") {
    errors.email = "Email not registered";
  }

  if (err.message === "Incorrect password") {
    errors.password = "Incorrect password";
  }

  // Handle signup errors
  // Check if the error is related to user validation
  if (err.message.includes("User validation failed")) {
    // Extract and process individual validation errors
    Object.values(err.errors).forEach(({ properties }) => {
      // Update the errors object with specific error messages
      // properties.path: The field that failed validation (e.g., 'email' or 'password')
      // properties.message: The corresponding error message for that field
      errors[properties.path] = properties.message;
    });
  }
  // Return the errors object containing field-specific error messages
  return errors;
};

const createToken = (id) => {
  return jwt.sign({ id }, myJwtSecret, { expiresIn: maxAge });
};

module.exports.signup_get = (req, res) => res.render("signup");

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check for existing user with the same email
    const userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      return res.status(400).json({ email: "This email is already in use" });
    }
    const user = await User.create({ email, password });

    // Once user is created and saved, create cookie and send it back to client
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // maxAge of 3 days in milliseconds
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.login_get = (req, res) => res.render("login");

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // maxAge of 3 days in milliseconds
    res.status(200).json({ user: user._id });
  } catch (error) {
    const err = handleErrors(error);
    res.status(400).json(err);
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
