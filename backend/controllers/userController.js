// ** USER ROUTES **

// Get User Data
exports.view = (req, res, next) => {
    const {user} = req.targets;
    res.redirect('/dashboard/' + user._id);
    /*res.json({
        message: "User details found",
        data: user,
    });*/
};

// Add User to Manager
exports.new = (req, res, next) => {
    let {manager} = req.targets;
    const {firstName, imageVideoUrl, otc} = req.body;

    const newUser = {
        firstName,
        imageVideoUrl,
        /*otc,*/
        otc: "temporary-otc-for-debug",
        otcIsValid: true,
    };

    manager.users.push(newUser);

    manager.save((err) => {
        if (err) return next(err);
        res.redirect('/dashboard');
        /*res.json({
            message: "New user created and linked successfully!",
            data: manager,
        });*/
    });
};


// Update User Data
exports.update = (req, res, next) => {
    const {manager, user} = req.targets;
    const {firstName, otc, otcIsValid, imageVideoUrl} = req.body;

    user.firstName = firstName ? firstName : user.firstName;
    user.otc = otc ? otc : user.otc;
    user.otcIsValid = otcIsValid ? otcIsValid : user.otcIsValid;
    let index = user.imageVideoUrl.indexOf(imageVideoUrl[0]);
    user.imageVideoUrl[index] = imageVideoUrl[1] ? imageVideoUrl[1] : user.imageVideoUrl[index];


    user.markModified('imageVideoUrl');     // need this otherwise array doesn't get saved!!! (https://stackoverflow.com/questions/24618584/mongoose-save-not-updating-value-in-an-array-in-database-document)
    manager.save((err) => {
        if (err) return next(err);
        res.redirect('/dashboard/' + user._id);
        /*res.json({
            message: "User updated successfully!",
            data: manager,
        });*/
    });
};

// Handle delete user
exports.delete = (req, res, next) => {
    const {manager, user} = req.targets;

    const targetIndex = manager.users.indexOf(user);
    manager.users.splice(targetIndex);

    manager.save((err) => {
        if (err) return next(err);
        res.redirect('/dashboard');
        /*res.json({
            message: "User deleted successfully!",
            data: manager,
        });*/
    });
};
