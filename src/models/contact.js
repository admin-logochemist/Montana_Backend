const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    message: { type: "string", required: true }
},
    {

        timestamps: true,

    })

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;