const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const path = require('path');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
const app = express();
const port = 3000;

// Requiring routes
const commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());
app.set('view engine', 'ejs');
// seed the database
// seedDB();

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

// This wil be added to every single template and route
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
