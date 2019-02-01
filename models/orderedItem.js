var mongoose = require("mongoose");

var OrderedItemSchema = new mongoose.Schema({
    created:    {type: Date, default: new Date },
    name:       {type: String, default: ""},
    quantity:   {type: String, default: "1"},
    type:       {type: String, default: "sztuka"},
    price:      String,
    discountedPrice: String,

});

module.exports = mongoose.model("OrderedItem", OrderedItemSchema);
