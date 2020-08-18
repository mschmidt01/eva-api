const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //UserId : String,
    FirstName: String,
    Lastname: String,
    Email: String,
    UserName: String,
    Password: String,
    Role: String,
});
const User = mongoose.model("User", UserSchema);
module.exports = User;