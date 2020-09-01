const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    TableName: String,
    QRCodeLink: String,
    secret: String,
    waitressCalled: Boolean,
}, {collection: 'table'});
const Table = mongoose.model("Table", TableSchema);
module.exports = Table;