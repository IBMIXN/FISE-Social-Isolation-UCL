// Initialize express router
const router = require('express').Router();
const passport = require('passport');
require('./passport')(passport);


// ROUTES
router.get('/', checkAuthenticated, function (req, res) {
    res.render('index.ejs', {name: "emil"});
}); // NEEDS COMPLETION

// MANAGER
var managerController = require('./controllers/managerController');

// Manager routes
router.route('/managers') // REMOVE IN FINAL
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
    .post(/*checkAuthenticated,*/ userController.new);  // commented for DEBUG reasons, TO-DO: uncomment in final build
router.route('/users/:otc/:user_id')
    .get(checkAuthenticated, userController.view)
    .patch(checkAuthenticated, userController.update)
    .put(/*checkAuthenticated,*/ userController.update)
    .delete(checkAuthenticated, userController.delete);
/*router.route('/users/:otc')
    .get(userController.view)*/


// CONTACT
var contactController = require('./controllers/contactController');
// Contact routes
// TO-DO: assign 'checkAuthenticated' to each route
router.route('/contacts')
    .get(contactController.index)
router.route('/contacts/:contact_id')
    .patch(contactController.update)
    .put(contactController.update)
router.route('/contacts/:user_id/:contact_id?')
    .get(contactController.view)
    .post(contactController.new)
    .delete(contactController.delete)
router.route('/call/:contact_name')
    .post(contactController.invite);


// Export API routes
module.exports = router;

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}