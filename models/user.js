const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// ADD fields username, password ( make them required )
userSchema.plugin(passportLocalMongoose);
// EXPORTS: USER
module.exports = mongoose.model("User", userSchema);