const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type: "string", required: true},
    secondName: {type: "string", required: true},
    email: {type: "string", required:true, unique: true},
    password: {type: "string", required:true},
})
const User = mongoose.model("user", userSchema);
module.exports = User;
