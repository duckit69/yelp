const express = require("express");
const wrapAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware");
const reviews = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router.delete("/:rid", isLoggedIn, isReviewOwner, wrapAsync(reviews.deleteReview));

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

module.exports = router;

