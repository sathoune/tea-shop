var mongoose = require("mongoose");

var ReservationSchema = new mongoose.Schema({
    date:           {type: Date,    default: Date.now },
    name:           {type: String,  default: "" },
    table:          {type: String,  default: "" },
    people:         {type: String,  default: "0" },
    waterPipe:      {type: String,  default: "" },
    hints:          {type: String,  default: "" },
    done:           {type: Boolean, default: false },
    expired:        {type: Boolean, default: false },
},
    {timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model("Reservation", ReservationSchema);
