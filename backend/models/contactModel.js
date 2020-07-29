// contactModelTemplate.js
var mongoose = require('mongoose');
var uuid = require('node-uuid');
// Setup schema
var contactSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v4()
    },
    firstName: {
        type: String,
        // required: true
    },
    avatarImage: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    relation: {
        type: Number,
        // required: true
    },
});
// Export Contact model
var Contact = module.exports = mongoose.model('contact', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}
