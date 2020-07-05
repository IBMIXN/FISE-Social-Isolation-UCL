// Import user model
User = require('./userModel');
// Handle index actions
exports.index = function (req, res) {
    User.get(function (err, users) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Users retrieved successfully",
            data: users
        });
    });
};
// Handle create user actions
exports.new = function (req, res) {
    var user = new User();
    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    user.otc = req.body.otc;
    user.otcIsValid = req.body.otcIsValid;
    user.imageVideoUrl = req.body.imageVideoUrl;
    user.Contacts = req.body.Contacts;
// save the user and check for errors
    user.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New user created!',
            data: user
        });
    });
};
// Handle view user info
exports.view = function (req, res) {
    User.find({otc: req.params.otc}, function (err, user) {
        if (err) {
            res.send(err);
        } else if (isEmpty(user)) {
            res.json({
                message: "OTC doesn't exist"
            });
        } else {
            res.json({
                message: 'User details loading..',
                data: user
            });
        }
    });
    // User.findById(req.params.otc, function (err, user) {
    //     if (err)
    //         res.send(err);
    //     res.json({
    //         message: 'User details loading..',
    //         data: user
    //     });
    // });
};
// Handle update user info
exports.update = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.send(err);
        user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
        user.otc = req.body.otc;
        user.otcIsValid = req.body.otcIsValid;
        user.imageVideoUrl = req.body.imageVideoUrl;
        user.Contacts = req.body.Contacts;
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
};
// Handle delete user
exports.delete = function (req, res) {
    User.deleteMany({
        _id: req.params.user_id
    }, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'User deleted'
        });
    });
};

// Used for when OTC doesn't exist
// https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
