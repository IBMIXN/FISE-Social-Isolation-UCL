User = require('../models/userModel');
Manager = require('../models/managerModel')

// Handle index actions
exports.index = function (req, res) {
    const manager = req.user;
    if (manager) {
        Manager.findById(manager._id, function (err, manager) {
            if (err) res.send(err);

            else if (manager) {
                res.json({
                    status: "success",
                    message: "Users retrieved successfully",
                    data: manager.Users
                });
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
};
// Handle create user actions
exports.new = function (req, res) {
    const manager = req.user;
    if (manager) {
        User.findOne({
            otc: req.body.otc,
        }, function (err, usr) {
            if (err) res.send(err);

            else if (!usr) {
                const user = new User();
                user.firstName = req.body.firstName;
                user.otc = req.body.otc;
                user.otcIsValid = req.body.otcIsValid;
                user.imageVideoUrl = req.body.imageVideoUrl;

                manager.Users.push(user);

                manager.save(function (err) {
                    if (err) res.send(err);
                    else {
                        // save the user and check for errors
                        user.save(function (err) {
                            if (err) res.send(err);

                            res.json({
                                message: 'New user created & added to ' + manager.email + '!',
                                data: manager
                            });
                        });
                    }
                });
            } else {
                res.json("ERROR: User already belongs to you or another Manager!");
            }
        });
    } else {
        res.redirect('/login');
    }
};

// Handle view user info
exports.view = function (req, res) {
    const manager = req.user;
    if (manager) {
        const user = manager.Users.find(usr => usr.otc === req.params.otc || usr._id === req.params.user_id);
        if (user) {
            res.json({
                message: 'User details loading..',
                data: user
            });
        } else {
            res.json("ERROR: You do not have access to this User or they do not exist!");
        }
    } else {
        res.redirect('/login');
    }
};

// Handle update user info
exports.update = function (req, res) {
    const manager = req.user;
    if (manager) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) res.send(err);

            else if (user) {
                Manager.findById(manager._id, function (err, manager) {
                    if (err) res.send(err);

                    else if (manager.Users.find(user2 => user2._id === user._id)) {
                        User.findOne({otc: req.body.otc}, function (err, usr) {
                            if (err) res.send(err);

                            else if (!usr) {
                                user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
                                user.otc = user.otc;    // TO-DO: Generate new OTC?
                                user.otcIsValid = user.otcIsValid;
                                user.imageVideoUrl = req.body.imageVideoUrl ? req.body.imageVideoUrl : user.imageVideoUrl;
                                user.Contacts = req.body.Contacts ? req.body.Contacts : user.Contacts;

                                // need index so that we change the correct User in the array
                                let index = manager.Users.findIndex(usr => usr._id === user._id);
                                manager.Users[index] = user;

                                manager.save(function (err) {
                                    if (err) res.send(err);

                                    else {
                                        // save the user and check for errors
                                        user.save(function (err) {
                                            if (err) res.send(err);

                                            res.json({
                                                message: 'User Info updated',
                                                data: user
                                            });
                                        });
                                    }
                                });
                            } else {
                                res.json("ERROR: Updated User already exists");
                            }
                        });
                    } else {
                        res.json("ERROR: You do not have access to this User!");
                    }
                });
            } else {
                res.json("ERROR: User does not exist!");
            }
        });
    } else {
        res.redirect('/login');
    }
};
// Handle delete user
exports.delete = function (req, res) {
    const manager = req.user;
    if (manager) {
        User.findById(req.params.user_id, function (err, user) {
            if (err) res.send(err);

            else if (user) {
                if (manager.Users.find(user2 => user2._id === user._id)) {
                    manager.Users.remove(user);

                    manager.save(function (err) {
                        if (err) res.send(err);

                        else {
                            Manager.find({"Users._id": user._id}, function (err, managers) {
                                if (err) res.send(err);

                                else if (!managers.length) {
                                    User.deleteOne({
                                        _id: req.params.user_id
                                    }, function (err) {
                                        if (err) res.send(err);

                                        res.json({
                                            status: "success",
                                            message: 'User deleted from ' + manager.email + ' and DB.',
                                            data: manager
                                        });
                                    });
                                } else {
                                    res.json('User removed from ' + manager.email + "!");
                                }
                            });
                        }
                    });
                } else {
                    res.json("ERROR: You do not have access to this User!");
                }
            } else {
                res.json("ERROR: No User found!");
            }
        });
    } else {
        res.redirect('/login');
    }
};
