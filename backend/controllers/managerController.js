// managerController.js
const bcrypt = require("bcryptjs");

Manager = require("../models/managerModel");

// Handle index actions
exports.index = function (req, res) {
    Manager.get(function (err, managers) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Managers retrieved successfully",
            data: managers.map((element) => ({email: element.email, name: element.name})),
        });
    });
};
// Handle create manager actions
exports.new = function (req, res) {
    let email = req.body.email;
    Manager.findOne({email: email}, function (err, manager) {
        if (err) {
            throw err;
        } else if (manager) {
            res.render("register.ejs", {email: email.toString()}); // for testing, replace with Adam frontend
        } else {
            let manager = new Manager();
            manager.email = req.body.email;
            manager.password = req.body.password;
            manager.name = req.body.name;
            manager.users = req.body.users;
            // save the manager and check for errors
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(manager.password, salt, function (err, hash) {
                    if (err) {
                        // res.json(err);
                        res.redirect("/register");
                    }
                    manager.password = hash;
                    manager.save(function (err) {
                        if (err) res.json(err);
                        else {
                            // res.json({
                            //     message: 'New manager created!',
                            //     data: manager
                            // });
                            res.redirect("/login");
                        }
                    });
                });
            });
        }
    });
};
// Handle view manager info
exports.view = function (req, res) {
    Manager.findById(req.params.manager_id, function (err, manager) {
        if (err) res.send(err);
        res.json({
            message: "Manager details loading..",
            data: manager.email,
        });
    });
};
// Handle update manager info
exports.update = function (req, res) {
    Manager.findById(req.params.manager_id, function (err, manager) {
        if (err) res.send(err);
        else {
            manager.email = req.body.email ? req.body.email : manager.email;
            manager.password = req.body.password;
            manager.users = req.body.users;
            // save the manager and check for errors
            manager.save(function (err) {
                if (err) res.json(err);
                res.json({
                    message: "Manager Info updated",
                    data: manager,
                });
            });
        }
    });
};
// Handle delete manager
exports.delete = function (req, res) {
    Manager.deleteMany(
        {
            _id: req.params.manager_id,
        },
        function (err) {
            if (err) res.send(err);
            res.json({
                status: "success",
                message: "Manager deleted",
            });
        }
    );
};
