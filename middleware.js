const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
//each middleware must have a req res next

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.URL = req.originalUrl;
        req.flash("Error", "Please Sign in First");
        return res.redirect("/users/login");
    }
    next();
}
module.exports.validateCampGround = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("Error", "You Dont Have permission");
        return res.redirect("/campgrounds");
    }
    next();
}
module.exports.isReviewOwner = async (req, res, next) => {
    const { id, rid } = req.params;
    const review = await Review.findById(rid);
    if (!review.author.equals(req.user._id)) {
        req.flash("Error", "You Dont Have permission");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}