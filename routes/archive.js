var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");


router.post("/", function(req, res) {
   res.send("archive route"); 
});


module.exports = router;