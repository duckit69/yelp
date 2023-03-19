const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampGround, isOwner } = require("../middleware");
const multer = require('multer');
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
const campgrounds = require("../controllers/campgrounds")

router.route("/")
    .get(wrapAsync(campgrounds.homePage))
    .post(isLoggedIn, upload.array("images"), validateCampGround, wrapAsync(campgrounds.createNewCampground));
router.get("/new", isLoggedIn, campgrounds.renderNewCampgroundForm);

router.route("/:id")
    .get(wrapAsync(campgrounds.showCampground))
    .patch(isLoggedIn, isOwner, upload.array("images"), validateCampGround, wrapAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isOwner, wrapAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(campgrounds.renderEditCampgroundForm));

module.exports = router;