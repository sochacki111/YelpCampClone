const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// Root route
router.get('/', (req, res) => {
    res.render('landing');
});

// Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
    let password = req.body.password;
    let newUser = new User({ username: req.body.username });
    User.register(newUser, password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('register');
        }
        // Log User in
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to YelpCamp ${user.username}!`);
            res.redirect('/campgrounds');
        });
    });
});

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Handling login logic
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    (req, res) => {}
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You need to be logged in to do that');
    res.redirect('/campgrounds');
});

module.exports = router;
