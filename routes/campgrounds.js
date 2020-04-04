const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

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
router.post('/', isLoggedIn, (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
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

// EDIT - Show edit form for one Campground
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/edit', { campground: campground });
        }
    });
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res, next) => {
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

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
