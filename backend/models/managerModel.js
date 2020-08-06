// managerModel.js
const mongoose = require('mongoose');
const uuid = require('node-uuid');

User = require('./userModel');

// Setup schema
const managerSchema = mongoose.Schema({
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
const Manager = module.exports = mongoose.model('manager', managerSchema);
module.exports.get = function (callback, limit) {
    Manager.find(callback).limit(limit);
}
