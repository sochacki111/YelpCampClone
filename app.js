const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
Campground = require('./models/campground');
Comment = require('./models/comment');
seedDB = require('./seeds');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
seedDB();

app.get('/', (req, res) => {
    res.render('landing');
});

/**
 * RESTFUL ROUTES
 */

// NEW - display form to make a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// INDEX - Show a list of Campgrounds
app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log('Something went wrong!');
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    });
});

// CREATE - Add new Campground to DB
app.post('/campgrounds', (req, res) => {
    // Get data from form and add to campgrounds array
    let campgroundName = req.body.name;
    let campgroundDescription = req.body.description;
    let campgroundImage = req.body.image;

    // Create new Campground and save to Database
    Campground.create(
        {
            name: campgroundName,
            description: campgroundDescription,
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
    Campground.findById(campgroundId).populate('comments').exec((err, campground) => {
        res.render('campgrounds/show', {campground: campground });
    });
});

// COMMENTS ROUTES

app.get('/campgrounds/:id/comments/new', (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', (req, res) => {
    let comment = req.body.comment;
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                } 
            });
        }
    });
});

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
