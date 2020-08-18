const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    // MenuItemId: String,
    CategoryId: String,
    Name: String,
    Description:String,
    Image: String,
    Ingredients: String,
    Additive: String,
    MenuItemPrice: Number,
});
const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
module.exports = MenuItem;