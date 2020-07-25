// Initialize express router
const router = require('express').Router();
const passport = require('passport');
require('./debug/config/passport')(passport);


// ROUTES
router.get('/', function (req, res) {
    res.json({message: "hello there"});
}); // NEEDS COMPLETION

// MANAGER
var managerController = require('./controllers/managerController');

// Manager routes
router.route('/managers')
    .get(checkAuthenticated, managerController.index)
    .post(checkAuthenticated, managerController.new);
router.route('/managers/:manager_id')
    .get(checkAuthenticated, managerController.view)
    .patch(checkAuthenticated, managerController.update)
    .put(checkAuthenticated, managerController.update)
    .delete(checkAuthenticated, managerController.delete);

// USER
var userController = require('./controllers/userController');
// User routes
router.route('/users')
    .get(checkAuthenticated, userController.index)
    .post(checkAuthenticated, userController.new);
router.route('/users/:user_id')
    // .get(checkAuthenticated, userController.view) // not needed?
    .patch(checkAuthenticated, userController.update)
    .put(checkAuthenticated, userController.update)
    .delete(checkAuthenticated, userController.delete);
router.route('/users/:otc')
    .get(userController.view)


// CONTACT
var contactController = require('./controllers/contactController');
// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);
router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);


//TEST
router.route('/call/:contact_name')
    .post(contactController.invite);
//TEST


// Export API routes
module.exports = router;

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
