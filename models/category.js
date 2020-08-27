const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    //CategoryId : String,
    name: String,
    image: String,
}, {collection: 'category'});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;