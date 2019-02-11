var mongoose = require("mongoose");

var MenuItemSchema = new mongoose.Schema({
    name: {type: String, default: ""},
    registerCode: {type: String,default: ""},
    prices: {
        default: {type: String, default: ""},
        gaiwan: {type: String, default: ""},
        package: {type: String, default: ""},
        bulk: {type: String, default: ""},
    },

},
   { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model("MenuItem", MenuItemSchema);
