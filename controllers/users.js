const User = require("../models/user");


module.exports.registerUserForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const u = new User({ username, email });
        const newUser = await User.register(u, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash("Success", "User Created Successfuly!");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("Error", "Already Exists");
        res.redirect("/users/login");
    }
}

module.exports.loginUserForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {
    req.flash("Success", "Welcome Back");
    const url = req.session.URL || "/campgrounds";
    delete req.session.URL;
    res.redirect(url);
}

module.exports.logoutUser = (req, res) => {
    req.logout(err => {
        if (err) next(err)
        req.flash("Success", "Good Bye");
        res.redirect("/campgrounds");
    });
}