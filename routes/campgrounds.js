const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
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
router.post('/', middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let image = req.body.image;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        description: description,
        image: image,
        author: author
    };

    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Created: \n' + campground);
        }
    });
    // Redirect back to campgrounds page
    res.redirect('/campgrounds');
});

// NEW - display form to make a new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - Show info about one Campground
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

// EDIT - Show edit form for one Campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render('campgrounds/edit', { campground: campground });
    });
});

router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        }
    );
});

router.delete('/:id', middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id, (err, campground) => {
        Comment.remove(
            {
                _id: {
                    $in: campground.comments
                }
            },
            err => {
                if (err) {
                    return next(err);
                }
                campground.remove();
                res.redirect('/campgrounds');
            }
        );
    });
});

module.exports = router;
