// Initialise the app
const express = require("express");
const app = express();


// BodyParser setup
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);


// Session setup
const session = require("express-session");
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // cookie: {secure: true}
    })
);


// Passport setup
const passport = require("passport");
require("./passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect("/dashboard");
    next();
}

function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
}


// DB Connection
const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Atlas connected successfully"))
    .catch((err) => console.log(err));


// Import routes
let apiRoutes = require("./api-routes");
app.use("/api", apiRoutes);

// Flash messages setup
const flash = require("express-flash");
app.use(flash());

// Views Setup
app.set("view-engine", "ejs");
app.use(express.static("public"));


// ---------------- Define Views ------------------
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.route("/login")
    .get(checkNotAuthenticated, function (req, res) {
        res.render("login.ejs");
    })
    .post(
        checkNotAuthenticated,
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/",
            failureFlash: true,
        })
    );

const managerController = require("./controllers/managerController");
app.route("/register")
    .get(checkNotAuthenticated, function (req, res) {
        res.render("register.ejs", { email: "" });
    })
    .post(checkNotAuthenticated, managerController.new);

app.route("/logout").get(function (req, res) {
    req.logout();
    res.redirect("/");
});

app.route("/dashboard").get(checkAuthenticated, function (req, res) {
    const user = req.user;
    res.render("dashboard.ejs", {
        name: user.name,
        email: user.email,
        users: user.users,
    });
});
// .post(checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/',
//     failureFlash: true
// }));

// Setup server port
var port = process.env.PORT || 8080;

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running FISE on port " + port);
});
