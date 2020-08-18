const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    //OrderrId : String,
    TableId: String,
    CustomerId: String,
    OrderItems: [String],
    StatusPayed: Boolean,
    OrderTimeStamp: Date,
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;