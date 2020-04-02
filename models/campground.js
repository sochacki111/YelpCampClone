const mongoose = require('mongoose');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});
const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;