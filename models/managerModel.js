// managerModel.js
const mongoose = require("mongoose");
const uuid = require("node-uuid");

// Setup schema
const managerSchema = mongoose.Schema({
  _id: {
    type: String,
    default: uuid.v4(),
  },
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  users: [
    {
      _id: {
        type: String,
        default: uuid.v4(),
      },
      firstName: {
        type: String,
        required: true,
      },
      otc: {
        type: String,
        required: true,
      },
      otcIsValid: {
        type: Boolean,
        required: true,
      },
      imageVideoUrl: {
        type: [String],
        required: true,
      },
      contacts: [
        {
          _id: {
            type: String,
            default: uuid.v4(),
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
        },
      ],
    },
  ],
});
// Export Manager model
const Manager = (module.exports = mongoose.model("manager", managerSchema));
module.exports.get = function (callback, limit) {
  Manager.find(callback).limit(limit);
};
