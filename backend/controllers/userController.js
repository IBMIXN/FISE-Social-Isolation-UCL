// Import user model
User = require('../models/userModel');
Manager = require('../models/managerModel')

// Handle index actions
exports.index = function (req, res) {
    Manager.findById(req.user._id, function (err, manager) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else {
            res.json({
                status: "success",
                message: "Users retrieved successfully",
                data: manager.Users
            });
        }
    });
};
// Handle create user actions
exports.new = function (req, res) {
    let user;
    User.findOne({
        firstName: req.body.firstName,
        otc: req.body.otc,
        otcIsValid: req.body.otcIsValid
    }, function (err, usr) {
        if (err) {
            res.json(err);
        }

        if (usr) {
            req.user.Users.push(usr);
            req.user.save(function (err) {
                if (err) {
                    res.json(err);
                }
                res.json({
                    message: "User added to " + req.user.email + '!',
                    data: req.user
                })
            });
        } else {
            user = new User();
            user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
            user.otc = req.body.otc;
            user.otcIsValid = req.body.otcIsValid;
            user.imageVideoUrl = req.body.imageVideoUrl;

            req.user.Users.push(user);

            req.user.save(function (err) {
                if (err) {
                    res.json(err);
                }
                // save the user and check for errors
                user.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'New user created & added to ' + req.user.email + '!',
                        data: req.user
                    });
                });
            });
        }
    });
};

// Handle view user info
exports.view = function (req, res) {
    let user = req.user.Users.find(usr => usr.otc === req.params.otc || usr._id === req.params.user_id);
    if (user) {
        res.json({
            message: 'User details loading..',
            data: user
        });
    } else {
        res.json("ERROR: You do not have access to this User or they do not exist!");
    }
};

// Handle update user info
exports.update = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);

        if (user) {
            Manager.findById(req.user._id, function (err, manager) {
                if (manager.Users.find(user2 => user2._id === user._id)) {
                    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
                    user.otc = req.body.otc ? req.body.otc : user.otc;
                    user.otcIsValid = req.body.otcIsValid ? req.body.otcIsValid : user.otcIsValid;
                    user.imageVideoUrl = req.body.imageVideoUrl ? req.body.imageVideoUrl : user.imageVideoUrl;
                    user.Contacts = req.body.Contacts ? req.body.Contacts : user.Contacts;

                    // need index so that we change the correct User in the array
                    let index = manager.Users.findIndex(user2 => user2._id === user._id);

                    manager.Users[index] = user;

                    manager.save(function (err) {
                        if (err) {
                            res.json(err);
                        }
                        // save the user and check for errors
                        user.save(function (err) {
                            if (err)
                                res.json(err);
                            res.json({
                                message: 'User Info updated',
                                data: user
                            });
                        });
                    });
                } else {
                    res.json("ERROR: You do not have access to this User!");
                }
            });
        } else {
            res.json("ERROR: User does not exist!");
        }
    });
};
// Handle delete user
exports.delete = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (user) {
            if (req.user.Users.find(user2 => user2._id === user._id)) {
                req.user.Users.remove(user);

                req.user.save(function (err) {
                    if (err) {
                        res.json(err);
                    }

                    Manager.find({"Users._id": user._id}, function (err, managers) {
                        if (!managers.length) {
                            User.deleteOne({
                                _id: req.params.user_id
                            }, function (err) {
                                if (err)
                                    res.send(err);
                                res.json({
                                    status: "success",
                                    message: 'User deleted from ' + req.user.email + ' and DB.',
                                    data: req.user
                                });
                            });
                        } else {
                            res.json('User removed from ' + req.user.email + "!");
                        }
                    });
                });
            } else {
                res.json("ERROR: You do not have access to this User!");
            }
        } else {
            res.json("ERROR: No User found!");
        }
    });
};
