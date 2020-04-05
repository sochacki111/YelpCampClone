const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comment new
router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

// Comment create
router.post('/', isLoggedIn, (req, res) => {
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
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// Comment edit form
router.get('/:comment_id/edit', (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {
                campground_id: req.params.id,
                comment: comment
            });
        }
    });
});

// Comment update
router.put('/:comment_id', (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, comment) => {
            if (err) {
                res.redirect('back');
            } else {
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        }
    );
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
