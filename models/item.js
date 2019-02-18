var mongoose = require("mongoose");

var ItemSchema = new mongoose.Schema({
    name:               {type: String, default: ""},
    quantity:           {type: String, default: "1"},
    type:               {type: String, default: "sztuka"},
    price:              {type: String, default: ""},
    discountedPrice:    {type: String, default: ""},
    registerCode:       {type: String, default: ""},
},
                        {timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model("Item", ItemSchema);
