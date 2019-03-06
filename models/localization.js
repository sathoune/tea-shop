var mongoose = require("mongoose");

var LocalizationSchema = new mongoose.Schema({
    language:   {type: String, default: "" },
    data:       {type: Object, default: {} },
},
    {timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model("Localization", LocalizationSchema);
