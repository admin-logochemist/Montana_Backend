const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    email: {type: String, required:true, unique: true},
    secondaryEmail: {type: String, default:""},
    country: {type: String, default:""},
    state: {type: String, default:""},
    zipcode: {type: String, default:""},
    phone: {type: String, default:""},
    password: {type: String, required:true},
    otp:{
      type: {type: String, default: ""},
      value: {type: String, default: ""},
      isVerified: {type: Boolean, default: false}
    }
},{
    timestamps: true,
  })
const User = mongoose.model("user", userSchema);
module.exports = User;
