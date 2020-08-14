// ** USER ROUTES **
var randomWords = require("random-words");

// Get User Data
exports.view = (req, res, next) => {
  const { user } = req.targets;
  res.redirect("/dashboard/" + user._id);
  /*res.json({
        message: "User details found",
        data: user,
    });*/
};

// Add User to Manager
exports.new = (req, res, next) => {
  let { manager } = req.targets;
  const { firstName, imageVideoUrl } = req.body;

  const otc = randomWords(4).join("-");

  const newUser = {
    firstName,
    imageVideoUrl,
    otc,
    otcIsValid: true,
  };

  manager.users.push(newUser);

  manager.save((err) => {
    if (err) return next(err);
    res.redirect("/dashboard");
    /*res.json({
            message: "New user created and linked successfully!",
            data: manager,
        });*/
  });
};

// Update User Data
exports.update = (req, res, next) => {
  const { manager, user } = req.targets;
  const { firstName, otcIsValid, imageVideoUrl } = req.body;

  if (otcIsValid) {
    if (!JSON.parse(otcIsValid)) {
      const otc = randomWords(4).join("-");
      user.otc = otc;
    }
  }

  user.firstName = firstName ? firstName : user.firstName;
  
  var newImageVideoUrl = imageVideoUrl
  const numOfImages = newImageVideoUrl.length
  if (!newImageVideoUrl[numOfImages-1]) {
    newImageVideoUrl.splice(numOfImages-1, 1)
  }
  
  user.imageVideoUrl = newImageVideoUrl

  manager.save((err) => {
    if (err) return next(err);
    res.redirect("/dashboard/" + user._id);
    /*res.json({
            message: "User updated successfully!",
            data: manager,
        });*/
  });
};

// Handle delete user
exports.delete = (req, res, next) => {
  const { manager, user } = req.targets;

  const targetIndex = manager.users.indexOf(user);
  manager.users.splice(targetIndex, 1);

  manager.save((err) => {
    if (err) return next(err);
    res.redirect("/dashboard");
    /*res.json({
            message: "User deleted successfully!",
            data: manager,
        });*/
  });
};
