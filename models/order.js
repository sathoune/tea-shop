var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
    created:  { type: Date, default: Date.now },
    discount: String,
    discountToGo: { type: Boolean, default: false},
    closed: { type: Boolean, default: false },
    orderedItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderedItem"
        }
   ],
});

module.exports = mongoose.model("Order", OrderSchema);
