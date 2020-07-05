// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});

// ROUTES

// MANAGER
var managerController = require('./managerController');
// Manager routes
router.route('/managers')
    .get(managerController.index)
    .post(managerController.new);
router.route('/managers/:manager_id')
    .get(managerController.view)
    .patch(managerController.update)
    .put(managerController.update)
    .delete(managerController.delete);

// USER
var userController = require('./userController');
// User routes
router.route('/users')
    .get(userController.index)
    .post(userController.new);
router.route('/users/:user_id')
    // .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);
router.route('/users/:otc')
    .get(userController.view)


// CONTACT
var contactController = require('./contactController');
// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);
router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);


// Export API routes
module.exports = router;


