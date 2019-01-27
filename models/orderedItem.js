var mongoose = require("mongoose");

var OrderedItemSchema = new mongoose.Schema({
    created: {type: Date, default: Date.now },
    name: String,
    quantity: String,
    type: String,
    price: String,

});

module.exports = mongoose.model("OrderedItem", OrderedItemSchema);
