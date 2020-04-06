const Campground = require('../models/campground');
const Comment = require('../models/comment');
// All the middleware goes here
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // Is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err || !campground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', 'You do not have permission to do that!');
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', 'You do not have permission to do that');
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first!');
    res.redirect('/login');
};

module.exports = middlewareObj;
