const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    //OrderrId : String,
    TableId: String,
    CustomerId: String,
    OrderItems: [Object],
    StatusPayed: Boolean,
    OrderTimeStamp: Date,
}, {collection: 'order'});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;