var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
    created:  { type: Date, default: Date() },
    discount: { type: String, default: "0" },
    discountToGo: { type: Boolean, default: false},
    closed: { type: Boolean, default: false },
    sum: { type: String, default: "0"},
    discountedSum: { type: String, default: "0"},
    table: String,
    orderedItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderedItem"
        }
   ],
});

module.exports = mongoose.model("Order", OrderSchema);
