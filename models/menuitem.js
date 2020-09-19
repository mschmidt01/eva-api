const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    // MenuItemId: String,
    categoryID: mongoose.Schema.ObjectId,
    name: String,
    description:String,
    image: String,
    awsimagekey: String,
    ingredients: String,
    additive: String,
    menuitemprice: Number,
}, {collection: 'MENUITEM'});
const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
module.exports = MenuItem;