const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log('Something went wrong!');
        } else {
            res.render('campgrounds', { campgrounds: campgrounds });
        }
    });
});

app.post('/campgrounds', (req, res) => {
    // Get data from form and add to campgrounds array
    let campgroundName = req.body.name;
    let campgroundImage = req.body.image;
    let newCampground = { name: campgroundName, image: campgroundImage };

    // Create new Campground and save to Database
    Campground.create(
        {
            name: campgroundName,
            image: campgroundImage
        },
        (err, campground) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Created: \n' + campground);
            }
        }
    );
    // campgrounds.push(newCampground);
    // Redirect back to campgrounds page
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
