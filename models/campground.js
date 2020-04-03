const mongoose = require('mongoose');

// SCHEMA SETUP
const CampgroundSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});
const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;
