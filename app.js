const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let campgrounds = [
    {
        name: 'Salmon Creek',
        image:
            'https://pixabay.com/get/57e6d7454e53ae14f1dc8460cf2934771438dbf85254794c712f7ed29348_340.jpg'
    },
    {
        name: 'Granite Hill',
        image:
            'https://pixabay.com/get/55e9d043485baa14f1dc8460cf2934771438dbf85254794c712f7ed29348_340.jpg'
    },
    {
        name: "Moutain Goat 's Rest",
        image:
            'https://pixabay.com/get/5fe3dc46425ab10ff3d89975c62b3e7f123ac3e45659744d752a7dd092_340.jpg'
    }
];

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', (req, res) => {
    // Get data from form and add to campgrounds array
    let campgroundName = req.body.name;
    let campgroundImage = req.body.image;
    let newCampground = { name: campgroundName, image: campgroundImage };

    // Insert new campground
    campgrounds.push(newCampground);
    // Redirect back to campgrounds page
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
