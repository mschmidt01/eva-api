const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    //TableId: String,
    TableName: String,
    QRCode: String,
    waitressCalled: Boolean,
}, {collection: 'table'});
const Table = mongoose.model("Table", TableSchema);
module.exports = Table;