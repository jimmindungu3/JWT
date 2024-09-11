const { Router } = require("express");
const authControllers = require("../controllers/authControllers");

const router = Router();

// sign up routes
router.get("/signup", authControllers.signup_get);
router.post("/signup", authControllers.signup_post);

// login routes
router.get("/login", authControllers.login_get);
router.post("/login", authControllers.login_post);

// logout route
router.get("/logout", authControllers.logout_get);

module.exports = router;
