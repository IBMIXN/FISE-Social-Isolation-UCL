User = require("../models/userModel");
Manager = require("../models/managerModel");

// Get User By OTC
exports.index = (req, res, next) => {
  Manager.find({}, (err, managers) => {
    if (err) return next(err);
    managers.map((manager) => {
      manager.Users.map((user) => {
        if (user.otcIsValid && user.otc === req.body.otc) {
          return res.json({
            message: "Users retrieved successfully",
            data: user,
          });
        }
      });
    });
  });
};

// Add User to Manager
exports.new = (req, res, next) => {
  const manager = req.user;

  const user = new User();
  user.firstName = req.body.firstName;
  user.otc = req.body.otc;
  user.otcIsValid = true; //req.body.otcIsValid;
  user.imageVideoUrl = req.body.imageVideoUrl;

  manager.Users.push(user);

  user.save((err) => {
    if (err) return next(err);
    manager.save((err) => {
      if (err) return next(err);
      res.json({
        message: "New user created and linked successfully!",
        data: manager,
      });
    });
  });
};

// Handle view user info
exports.view = (req, res, next) => {
  const manager = req.user;
  const user = manager.Users.find((usr) => usr._id === req.params.user_id);
  res.json({
    message: "User details found",
    data: user,
  });
};

// Update User Data
exports.update = (req, res, next) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return next(err);
    user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
    user.otc = req.body.otc ? req.body.otc : user.otc;
    user.otcIsValid = req.body.otcIsValid
      ? req.body.otcIsValid
      : user.otcIsValid;
    user.imageVideoUrl = req.body.imageVideoUrl
      ? req.body.imageVideoUrl
      : user.imageVideoUrl;
    // user.Contacts = user.Contacts;

    user.save((err) => {
      if (err) return next(err);

      res.json({
        message: "User Info updated",
        data: user,
      });
    });
  });
};

// Handle delete user
exports.delete = (req, res, next) => {
  let manager = req.user;
  let user_id = req.params.user_id;

  User.findOne({ _id: user_id }, (err, user) => {
    manager.Users.remove(user);
    manager.save((err) => {
      if (err) return next(err);
      User.findByIdAndDelete(user_id, (err) => {
        if (err) return next(err);
        res.status(200).send({ message: "User Deleted" });
      });
    });
  });
};
