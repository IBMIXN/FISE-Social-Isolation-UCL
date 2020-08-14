import mongoose from "mongoose";
import uuid from "node-uuid"

/* UserSchema will correspond to a collection in your MongoDB database. */
const usersSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
  },
  name: {
    /* The name of the user */
    type: String,
    required: false,
    maxlength: [20, "Name cannot be more than 20 characters"],
  },
  email: {
    /* The email address of the user */
    type: String,
    required: [true, "Please provide your email address"],
    maxlength: [30, "Email address cannot be more than 30 characters"],
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  consumers: [
    {
      _id: {
        type: String,
        default: uuid.v4(),
      },
      otc: {
        type: String,
        required: true,
      },
      name: {
        /* The name of the user */
        type: String,
        required: [true, "Please provide a name for this user."],
        maxlength: [20, "Name cannot be more than 20 characters"],
      },
      ar_scenes: {
        type: [String],
        required: false,
      },
      isCloudEnabled: {
        type: Boolean,
        required: true,
      },
      contacts: [
        {
          _id: {
            type: String,
            default: uuid.v4(),
          },
          name: {
            /* The name of the contact */
            type: String,
            required: [true, "Please provide a name for this contact."],
            maxlength: [20, "Name cannot be more than 20 characters"],
          },
          email: {
            type: String,
            required: true,
          },
          avatarImage: {
            type: String,
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

export default mongoose.models.users || mongoose.model("users", usersSchema);
