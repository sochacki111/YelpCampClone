const mongoose = require('mongoose');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
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
const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
