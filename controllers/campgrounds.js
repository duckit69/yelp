const Campground = require("../models/campground");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require("../cloudinary/index");

module.exports.homePage = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewCampgroundForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createNewCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 2
    })
        .send();
    const geometry = geoData.body.features[0].geometry;
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.geometry = geometry;
    await campground.save();
    console.log(campground);
    req.flash("Success", "Successfuly Created!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("Error", "CAMPGROUND DOESNT EXIST");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditCampgroundForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("Error", "CAMPGROUND DOESNT EXIST");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const testImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...testImages);
    await campground.save();
    if (req.body.deleteImages) {
        await campground.updateOne({
            $pull: {
                images: {
                    filename: { $in: req.body.deleteImages }
                }
            }
        })
        for (let img of req.body.deleteImages) {
            cloudinary.uploader
                .destroy(img);
        }
    }

    console.log(req.body.deleteImages)
    req.flash("Success", "Successfuly Updated!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("Success", "Successfuly Deleted!");
    return res.redirect(`/campgrounds`);
}