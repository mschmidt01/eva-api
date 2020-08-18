const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    //CustomerId : String,
    SessionId: String,
    OrderId: String,
    FirstName: String,
    Lastname: String,
    Street: String,
    HouseNumber: String,
    Zip: Number,
    City: String,
    TelNumber: String,
    TimeStampStart: Date,
    TimeStampEnd: Date,
});
const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;