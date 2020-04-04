const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// INDEX - Show a list of Campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    });
});

// CREATE - Add new Campground to DB
router.post('/', (req, res) => {
    Campground.create(
        {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
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

// NEW - display form to make a new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - Show info about one Campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec((err, campground) => {
            res.render('campgrounds/show', { campground: campground });
        });
});

module.exports = router;
