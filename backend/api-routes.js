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

router.route("/users/otc").get(userController.index); // Get User Data with OTC
router.route("/users").post(checkAuthenticated, userController.new); // Add User to Manager
router
  .route("/users/:user_id")
  .get(checkAuthenticated, checkManagerOwnsUser, userController.view); // Get User Data
router
  .route("/users/update/:user_id")
  .post(checkAuthenticated, checkManagerOwnsUser, userController.update); // Update User Data
router
  .route("/users/delete/:user_id")
  .post(checkAuthenticated, checkManagerOwnsUser, userController.delete); // Update User Data

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
router.route("/call/contact/:contact_id").post(contactController.invite); // Call User's Contact

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.redirect("/login");
}

async function checkManagerOwnsUser(req, res, next) {
  const manager = req.user;
  const user_id = req.body.user_id ? req.body.user_id : req.params.user_id;
  const userInUser = await User.findById(user_id);
  const userInManager = manager.Users.find((usr) => usr._id === user_id);
  if (userInManager) {
    req.userInUser = userInUser;
    req.userInManager = userInManager;
    return next();
  }
  res.status(403).send({
    message: "Either you don't have access to that user or it doesn't exist!",
  });
}

async function checkManagerOwnsContact(req, res, next) {
  let manager = req.user;
  let contact_id = req.body.contact_id
    ? req.body.contact_id
    : req.params.contact_id;

  const userInManager = manager.Users.find((usr) =>
    usr.Contacts.find((contact) => contact._id === contact_id)
  );
  const user = await User.findById(userInManager._id);
  req.params.user_id = userInManager._id;

  if (userInManager) {
    return next();
  }
  res.status(403).send({
    message: "You don't have access to that contact!",
  });
}

// Export API routes
module.exports = router;
