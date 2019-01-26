var mongoose = require("mongoose");

var MenuItemSchema = new mongoose.Schema({
   name: String,
   registerCode: String,
   prices: {
       default: String,
       gaiwan: String,
       package: String,
       bulk: String,
   }
   
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
