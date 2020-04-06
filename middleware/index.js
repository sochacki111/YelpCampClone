const Campground = require('../models/campground');
const Comment = require('../models/comment');
// All the middleware goes here
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // Is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log(err);
            } else if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        });
    } else {
        // If not, redirect
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(
    req,
    res,
    next
) {
    // Is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log(err);
            } else if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        });
    } else {
        // If not, redirect
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = middlewareObj;
