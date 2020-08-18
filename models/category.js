const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    //CategoryId : String,
    Name: String,
    Image: String,
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;