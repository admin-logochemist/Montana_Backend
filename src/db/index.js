const mongoose = require('mongoose');
require('dotenv').config();

exports.ConnectDB = async () => {
    console.log("link DB->",process.env.MONGO_URI)
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to the database");
    } catch (error) {
        console.log("error, while connecting to DB")
    }
}