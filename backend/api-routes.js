// Initialize express router
const router = require("express").Router();
const passport = require("passport");
require("./passport")(passport);

// /api/managers routes
const managerController = require("./controllers/managerController");

router
    .route("/managers")
    .get(checkAuthenticated, managerController.view) // Get Manager's Data
    .post(managerController.new); // Create New Manager
router
    .route("/managers/update")
    .post(checkAuthenticated, managerController.update); // Update Manager's Data
router
    .route("/managers/delete")
    .post(checkAuthenticated, managerController.delete); // Delete Manager

// /api/users routes
const userController = require("./controllers/userController");

router.route("/users/otc").get(checkOtcIsValid, userController.view); // Get User Data with OTC
router.route("/users").post(checkAuthenticated, userController.new); // Add User to Manager
router
    .route("/users/:user_id")
    .get(checkAuthenticated, checkManagerOwnsUser, userController.view); // Get User Data
router
    .route("/users/update/:user_id")
    .post(checkAuthenticated, checkManagerOwnsUser, userController.update); // Update User Data
router
    .route("/users/delete/:user_id")
    .post(checkAuthenticated, checkManagerOwnsUser, userController.delete); // Delete User Data

// /api/contacts routes
const contactController = require("./controllers/contactController");

router
    .route("/contacts/new/:user_id")
    .post(checkAuthenticated, checkManagerOwnsUser, contactController.new); // Add Contact to User
router
    .route("/contacts/:contact_id")
    .get(checkAuthenticated, checkManagerOwnsContact, contactController.view); // Get Contact
router
    .route("/contacts/update/:contact_id")
    .post(checkAuthenticated, checkManagerOwnsContact, contactController.update); // Update User's Contact
router
    .route("/contacts/delete/:contact_id")
    .post(checkAuthenticated, checkManagerOwnsContact, contactController.delete); // Delete User's Contact
router
    .route("/call/contact/:contact_id")
    .post(checkOtcIsValid, contactController.invite); // Call User's Contact

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        req.targets = {};
        req.targets.manager = req.user;
        return next();
    }
    res.redirect("/login");
}

async function checkOtcIsValid(req, res, next) {
    const {otc} = req.body;

    const all_managers = await Manager.find({});
    const manager = all_managers.filter((manager) =>
        manager.users.filter((user) => user.otc === otc)
    )[0];
    const user = manager.users.filter((user) => user.otc === otc)[0];

    if (manager && user && user.otcIsValid) {
        req.targets = {manager, user};
        return next();
    }

    res.status(403).send({
        message:
            "Either you don't have access to that app user or it doesn't exist!",
    });
}

async function checkManagerOwnsUser(req, res, next) {
    const {manager} = req.targets;
    const user_id = req.body.user_id ? req.body.user_id : req.params.user_id;

    const user = manager.users.filter((user) => user._id === user_id)[0];

    if (user) {
        req.targets.user = user;
        return next();
    }

    res.status(403).send({
        message: "Either you don't have access to that user or it doesn't exist!",
    });
}

async function checkManagerOwnsContact(req, res, next) {
    const {manager} = req.targets;
    const contact_id = req.params.contact_id;/*req.body.contact_id
        ? req.body.contact_id
        : req.params.contact_id*/

    /*const user = manager.users.filter((user) =>
        user.contacts.filter((contact) => contact._id === contact_id)
    )[0];*/
    const user = manager.users.find(usr => usr.contacts.includes(usr.contacts.find(cont => cont._id === contact_id)));

    const contact = user.contacts.filter(
        (contact) => contact._id == contact_id
    )[0];

    if (manager && user && contact) {
        req.targets.user = user;
        req.targets.contact = contact;
        return next();
    }

    res.status(403).send({
        message:
            "Either you don't have access to that contact or it doesn't exist!",
    });
}

// Export API routes
module.exports = router;
