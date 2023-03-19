const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.deleteReview = async (req, res) => {
    const { id, rid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    req.flash("Success", "Successfuly Deleted a Review");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const { rating, body } = req.body.review;
    const r = new Review({ rating, body });
    const campground = await Campground.findById(id);
    r.author = req.user._id;
    campground.reviews.push(r);
    await r.save();
    await campground.save();
    req.flash("Success", "Successfuly Created a Review");
    res.redirect(`/campgrounds/${id}`);
}