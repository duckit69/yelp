const express = require("express");
const passport = require("passport");
const router = express.Router();
const wrapasync = require("../utils/catchAsync");
const users = require("../controllers/users");


router.route("/register")
    .get(users.registerUserForm)
    .post(wrapasync(users.registerUser));

router.route("/login")
    .get(users.loginUserForm)
    .post(passport.authenticate("local", { keepSessionInfo: true, failureFlash: true, failureRedirect: "/users/login" }), users.loginUser);

router.get("/logout", users.logoutUser)

module.exports = router;