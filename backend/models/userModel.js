// userModelTemplate.js
const mongoose = require('mongoose');
const uuid = require('node-uuid');

Contact = require('./contactModel');

// Setup schema
const userSchema = mongoose.Schema({
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
        // required: true
    },
    Contacts: {
        type: [Contact.schema],
        // required: true
    },
});
// Export User model
const User = module.exports = mongoose.model('user', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}
