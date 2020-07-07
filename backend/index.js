const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev: dev });
const handle = server.getRequestHandler();

server.prepare().then(() => {
    // Initialise the app
    const app = express();

    // Import routes
    let apiRoutes = require("./api-routes");
    // Configure bodyparser to handle post requests
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());


    // Connecting to DB
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("MongoDB Atlas connected successfully"))
        .catch(err => console.log(err));


    // Setup server port
    var port = process.env.PORT || 8080;

    // Use Api routes in the App
    app.use('/api', apiRoutes);

    app.all('*', (req, res) => {
        return handle(req, res);
    });

    // Launch app to listen to specified port
    app.listen(port, function () {
        console.log(`> Running FISE on http://localhost:${port}`);
    });
});
