var mongoose = require("mongoose");

var MenuItemSchema = new mongoose.Schema({
   name: String,
   registerCode: String,
   prices: {
       default_price: String,
       gaiwan_price: String,
       package_price: String,
       bulk: String,
   }
   
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
