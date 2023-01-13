const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema.Types

const userSchema = mongoose.Schema(
  {
    //  changed
    username: {
      type: String, //small
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    role: {
      type: Array,
      default: 'User',
    },
    // want to change
    phoneNumber: {
      type: String,
      required: true,
    },
    channel: [
      {
        type: ObjectId,
        ref: 'Channel',
      },
    ],
    phoneOtp: String,
  },
  { timestamps: true }
)

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
