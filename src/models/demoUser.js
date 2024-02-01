const mongoose = require('mongoose');

const demoUserSchema = mongoose.Schema({
    name: {type: "string", required: true},
    email: {type: "string", required:true, unique: true},
    contact: {type: "string", required: true},
    password: {type: "string", required:true},
},{
    timestamps: true,
  })
const Demouser = mongoose.model("demouser", demoUserSchema);
module.exports = Demouser;
