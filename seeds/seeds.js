const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors } = require("./seedHelpers");
const { places } = require("./seedHelpers");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: "pk.eyJ1IjoiZHVja2l0NjkiLCJhIjoiY2xmYjBvbjN4MjRxdTQwbzQwbWhuaXZzMSJ9.Md_1ockQRn0ibIbUwT5pZQ" });
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch(e => {
        console.log("DB NOT CONNECTED");
        console.log(e);
    })

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const random1000 = Math.floor(Math.random() * 48);
        const random12 = Math.floor(Math.random() * descriptors.length);
        const random10 = Math.floor(Math.random() * places.length);
        const c = new Campground({
            title: `${descriptors[random12]} ${places[random10]}`,
            location: `${cities[random1000].city}, ${cities[random1000].country}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dxfxc684j/image/upload/v1679087926/Yelp_Project/aq8idny5v7se968sfqvj.jpg",
                    filename: `${descriptors[random12]} ${places[random10]}`
                },
                {
                    url: "https://res.cloudinary.com/dxfxc684j/image/upload/v1679087959/Yelp_Project/lmfdvyyge02baohx1yrs.jpg",
                    filename: `${descriptors[random12]} ${places[random10]}`
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est quis dolore odio veniam facere error, deserunt assumenda libero. Sunt sapiente perspiciatis eos possimus enim est molestiae ducimus non consequuntur fugiat?",
            price: (Math.floor(Math.random() * 25) + 12),
            author: "640ba11a9c6835463c503fae",
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].lng,
                    cities[random1000].lat
                ]
            }
        });
        await c.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});