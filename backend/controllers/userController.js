// ** USER ROUTES **

// Get User Data
exports.view = (req, res, next) => {
  const { user } = req.targets;
  res.json({
    message: "User details found",
    data: user,
  });
};

// Add User to Manager
exports.new = (req, res, next) => {
  let { manager } = req.targets;

  const newUser = {
    firstName: "AdamUser",
    imageVideoUrl: "https://google.com",
    otc: "thisismylongotc",
    otcIsValid: true,
  };

  manager.users.push(newUser);

  manager.save((err) => {
    if (err) return next(err);
    res.json({
      message: "New user created and linked successfully!",
      data: manager,
    });
  });
};


// Update User Data
exports.update = (req, res, next) => {
  const { manager, user } = req.targets;

  user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
  user.otc = req.body.otc ? req.body.otc : user.otc;
  user.otcIsValid = req.body.otcIsValid ? req.body.otcIsValid : user.otcIsValid;
  user.imageVideoUrl = req.body.imageVideoUrl
    ? req.body.imageVideoUrl
    : user.imageVideoUrl;

  manager.save((err) => {
    if (err) return next(err);
    res.json({
      message: "New user created and linked successfully!",
      data: manager,
    });
  });
};

// Handle delete user
exports.delete = (req, res, next) => {
  const { manager, user } = req.targets;

  const targetIndex = manager.users.indexOf(user);
  manager.users.splice(targetIndex);

  manager.save((err) => {
    if (err) return next(err);
    res.json({
      message: "New user created and linked successfully!",
      data: manager,
    });
  });
};
