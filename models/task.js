var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
    day:            {type: String, default: "Noneday"},
    task:           {type: String, default: ""},
    done:           {type: Boolean, default: false},
},
                        {timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model("Task", TaskSchema);
