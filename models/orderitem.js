const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    //OrderId : String,
    // MenuItemId: String,
    Quantity: Number,
    StatusServed: Boolean,
    MenuItemId: String,
}, {collection: 'orderitem'});
const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
module.exports = OrderItem;