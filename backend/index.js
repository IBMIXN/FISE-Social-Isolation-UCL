const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
Manager = require('./models/managerModel');
require('./passport')(passport);

// Initialise the app
const app = express();


// Import routes
let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connecting to DB
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB Atlas connected successfully"))
    .catch(err => console.log(err));


// Setup server port
var port = process.env.PORT || 8080;

app.set('view-engine', 'ejs');

// Send message for default URL
app.get('/', (req, res) => {
    res.json({message: "hello there"});
});


let managerController = require('./controllers/managerController');
app.route('/login')
    .get(checkNotAuthenticated, function (req, res) {
        res.render('login.ejs');
    })
    .post(checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/api',       // this is where admin panel would go
        failureRedirect: '/register',
        failureFlash: true
    }));

app.route('/register')
    .get(checkNotAuthenticated, function (req, res) {
        res.render('register.ejs', {email: ''});
    })
    .post(checkNotAuthenticated, managerController.new);

app.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.redirect('/login');
    });

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running FISE on port " + port);
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('./api');
    }
    next();
}
