const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
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

/**
 * PASSPORT CONFIGURATION
 */
// Setup express session
app.use(
    require('express-session')({
        secret: 'This is very classified!',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Use static authenticate method of model in LocalStrategy
// It comes from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));

// Use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * CAMPGROUND ROUTES
 */
app.get('/', (req, res) => {
    res.render('landing');
});

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
    Campground.findById(campgroundId)
        .populate('comments')
        .exec((err, campground) => {
            res.render('campgrounds/show', { campground: campground });
        });
});

/**
 * COMMENT ROUTES
 */
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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

/**
 * AUTH ROUTES
 */

// Show Register form
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    let password = req.body.password;
    let newUser = new User({ username: req.body.username });
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        // Log User in
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// Show Login form
app.get('/login', (req, res) => {
    res.render('login');
});

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    (req, res) => {}
);

// Logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
