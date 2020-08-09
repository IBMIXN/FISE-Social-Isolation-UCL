// managerController.js
const bcrypt = require("bcryptjs");

Manager = require("../models/managerModel");

// Get Manager's Data
exports.view = (req, res, next) => {
  const manager = req.user;
  res.json({
    message: "Manager details retrieved successfully!",
    data: {
      email: manager.email,
      name: manager.name,
      _id: manager._id,
      Users: manager.Users,
    },
  });
};

// Create New Manager
exports.new = (req, res, next) => {
  let email = req.body.email;
  Manager.findOne({ email: email }, function (err, manager) {
    if (err) {
      return next(err);
    } else if (manager) {
      res.render("login.ejs", { email: email.toString() });
    } else {
      let manager = new Manager();
      manager.email = req.body.email;
      manager.password = req.body.password;
      manager.name = req.body.name;
      manager.users = req.body.users;
      // save the manager and check for errors
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(manager.password, salt, function (err, hash) {
          if (err) return next(err);
          manager.password = hash;
          manager.save((err) => {
            if (err) return next(err);
            res.redirect("/login");
          });
        });
      });
    }
  });
};

// Update Manager's Data
exports.update = (req, res, next) => {
  Manager.findById(req.user["_id"], function (err, manager) {
    if (err) return next(err);
    manager.email = req.body.email ? req.body.email : manager.email;
    // manager.password = req.body.password; TODO: FIX THIS (we need to check req.body.confirmPassword then manager.password <- hash(req.body.password))
    manager.users = req.body.users;
    // save the manager and check for errors
    manager.save((err) => {
      if (err) return next(err);
      res.json({
        message: "Manager Info updated",
        data: manager,
      });
    });
  });
};

// Delete Manager
exports.delete = (req, res, next) => {
  let manager = req.user;
  Manager.deleteMany(
    {
      _id: manager._id,
    },
    function (err) {
      if (err) next(err);
      res.json({
        status: "success",
        message: "Manager deleted",
      });
    }
  );
};
