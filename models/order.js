var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
    created:  { type: Date, default: Date.now },
    discount: { type: String, default: "0" },
    discountToGo: { type: Boolean, default: false},
    closed: { type: Boolean, default: false },
    sum: String,
    discountedSum: String,
    table: String,
    orderedItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderedItem"
        }
   ],
});

module.exports = mongoose.model("Order", OrderSchema);
