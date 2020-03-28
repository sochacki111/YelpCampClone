const express = require('express');
const app = express();
const port = 3000;

const campgrounds = [
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

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(port, () => {
    console.log('YelpCamp Server has started!');
});
