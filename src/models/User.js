const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 10,
    unique: true
  },
  email: {
    type: String,
    required: true,
    max: 30,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  profilePicture: {
    type: String,
    default: ""
  },
  profilePicture: {
    type: String,
    default: ""
  },
  followers: {
    type: Array,
    default: []
  },
  following: {
    type: Array,
    default: []
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);