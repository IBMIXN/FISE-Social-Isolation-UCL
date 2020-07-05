// userModelTemplate.js
var mongoose = require('mongoose');
Contact = require('./contactModel');
var uuid = require('node-uuid');
// Setup schema
var userSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4()
    },
    firstName: {
        type: String,
        required: true
    },
    otc: {
        type: String,
        required: true
    },
    otcIsValid: {
        type: Boolean,
        required: true
    },
    imageVideoUrl: {
        type: [String],
        required: true
    },
    Contacts: {
        type: [Contact.schema],
        required: true
    },
});
// Export User model
var User = module.exports = mongoose.model('user', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
