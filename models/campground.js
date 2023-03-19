const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const opts = {toJSON: { virtuals:true } };

const ImgSchema = new Schema({
    url: String,
    filename: String
})
ImgSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
})

const CamproundSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    images: [ImgSchema],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    geometry: {
        "type": {
            type: String,
            enum: ["Point"],
            required: true
        },
        "coordinates": {
            type: [Number],
            required: true
        }
    }
}, opts);


CamproundSchema.virtual("properties.popUp").get(function () {
    return this._id;
})
CamproundSchema.virtual("properties.title").get(function () {
    return this.title;
})
CamproundSchema.post("findOneAndDelete", async doc => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

const Campground = mongoose.model("Campground", CamproundSchema);
module.exports = Campground;