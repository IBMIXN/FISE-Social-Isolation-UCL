// managerModel.js
var mongoose = require('mongoose');
User = require('./userModel');
var uuid = require('node-uuid');
// Setup schema
var managerSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4()
    },
    /*name: { // TO-DO: not needed?
        type: String,
        required: true,
    },*/
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Users: {
        type: [User.schema]
    },
});
// Export Manager model
var Manager = module.exports = mongoose.model('manager', managerSchema);
module.exports.get = function (callback, limit) {
    Manager.find(callback).limit(limit);
}
