// contactModelTemplate.js
const mongoose = require("mongoose");
const uuid = require("node-uuid");
// Setup schema
const contactSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4(),
  },
  owner: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  avatarImage: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    required: true,
  },
  relation: {
    type: Number,
    required: true,
  },
});
// Export Contact model
const Contact = (module.exports = mongoose.model("contact", contactSchema));
module.exports.get = function (callback, limit) {
  Contact.find(callback).limit(limit);
};
