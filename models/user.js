const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //UserId : String,
    FirstName: String,
    Lastname: String,
    email: String,
    username: String,
    password: String,
    Role: String,
    passwordResetToken: {type: String, required: false},
    passwordResetTokenExpiryDate: {type: Date, required: false},
    hash:  {type: String, required: false},
    salt:  {type: String, required: false}
});
const User = mongoose.model("User", UserSchema);
module.exports = User;