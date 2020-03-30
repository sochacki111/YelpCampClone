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

/**
 * RESTFUL ROUTES
 */

// NEW - display form to make a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

// INDEX - Show a list of Campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log('Something went wrong!');
        } else {
            res.render('index-campgrounds', { campgrounds: campgrounds });
        }
    });
});

// CREATE - Add new Campground to DB
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
    // Redirect back to campgrounds page
    res.redirect('/campgrounds');
});

// SHOW - Show info about one Campground
app.get('/campgrounds/:id', (req, res) => {
    let campgroundId = req.params.id;
    console.log(campgroundId);
    Campground.findById(campgroundId, (err, campground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show-campground', {campground: campground});
        }
    });
});

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
