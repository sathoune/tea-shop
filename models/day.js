var mongoose = require("mongoose");

var DaySchema = new mongoose.Schema({
    sum:            { type: String, default: "0"},
    discountedSum:  { type: String, default: "0"},
    orders: [
        {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Order"
        }
    ],
    items: [
        {
            name: { type: String, default: "0" },
            default:        {type: String, default: "0"},
            gaiwan:         {type: String, default: "0"},
            package:        {type: String, default: "0"},
            bulk:           {type: String, default: "0"},
            bulkOrders:     {type: String, default: "0"},
            income:         {type: String, default: "0"},
        }
   ],
},
                    {timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model("Day", DaySchema);
