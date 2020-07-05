// managerController.js
// Import manager model
Manager = require('./managerModel');
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
            data: managers
        });
    });
};
// Handle create manager actions
exports.new = function (req, res) {
    var manager = new Manager();
    manager.email = req.body.email ? req.body.email : manager.email;
    manager.password = req.body.password;
    manager.users = req.body.users;
// save the manager and check for errors
    manager.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: 'New manager created!',
            data: manager
        });
    });
};
// Handle view manager info
exports.view = function (req, res) {
    Manager.findById(req.params.manager_id, function (err, manager) {
        if (err)
            res.send(err);
        res.json({
            message: 'Manager details loading..',
            data: manager
        });
    });
};
// Handle update manager info
exports.update = function (req, res) {
    Manager.findById(req.params.manager_id, function (err, manager) {
        if (err)
            res.send(err);
        manager.email = req.body.email ? req.body.email : manager.email;
        manager.password = req.body.password;
        manager.users = req.body.users;
// save the manager and check for errors
        manager.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Manager Info updated',
                data: manager
            });
        });
    });
};
// Handle delete manager
exports.delete = function (req, res) {
    Manager.remove({
        _id: req.params.manager_id
    }, function (err, manager) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Manager deleted'
        });
    });
};
