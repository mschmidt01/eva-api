const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    //InvoiceId : String,
    OrderId : String,
    InvoiceDate: Date,
    Amount: Number,
});
const Invoice = mongoose.model("Invoice", InvoiceSchema);
module.exports = Invoice;