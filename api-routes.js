// Initialize express router
const router = require("express").Router();
const passport = require("passport");
require("./passport")(passport);

const validateInputs = require("./middlewares/validateInputs");
const authorization = require("./middlewares/authorization");

// /api/managers routes
const managerController = require("./controllers/managerController");

router
  .route("/managers")
  .get(authorization.checkAuthenticated, managerController.view) // Get Manager's Data
  .post(managerController.new); // Create New Manager
router
  .route("/managers/update")
  .post(authorization.checkAuthenticated, validateInputs, managerController.update); // Update Manager's Data
router
  .route("/managers/delete")
  .post(authorization.checkAuthenticated, managerController.delete); // Delete Manager

// /api/users routes
const userController = require("./controllers/userController");

router
  .route("/users/otc")
  .get(authorization.checkOtcIsValid, userController.view); // Get User Data with OTC
router
  .route("/users")
  .post(authorization.checkAuthenticated, validateInputs, userController.new); // Add User to Manager
router
  .route("/users/:user_id")
  .get(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsUser,
    userController.view
  ); // Get User Data
router
  .route("/users/update/:user_id")
  .post(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsUser,
    validateInputs,
    userController.update
  ); // Update User Data
router
  .route("/users/delete/:user_id")
  .post(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsUser,
    userController.delete
  ); // Delete User Data

// /api/contacts routes
const contactController = require("./controllers/contactController");

router
  .route("/contacts/new/:user_id")
  .post(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsUser,
    validateInputs,
    contactController.new
  ); // Add Contact to User
router
  .route("/contacts/:contact_id")
  .get(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsContact,
    contactController.view
  ); // Get Contact
router
  .route("/contacts/update/:contact_id")
  .post(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsContact,
    validateInputs,
    contactController.update
  ); // Update User's Contact
router
  .route("/contacts/delete/:contact_id")
  .post(
    authorization.checkAuthenticated,
    authorization.checkManagerOwnsContact,
    contactController.delete
  ); // Delete User's Contact
router
  .route("/call/contact/:contact_id")
  .post(authorization.checkOtcIsValid, contactController.invite); // Call User's Contact

// Export API routes
module.exports = router;
