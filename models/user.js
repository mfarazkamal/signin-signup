const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/authtestapp");

const authSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    age: Number
})

module.exports = mongoose.model("user", authSchema);