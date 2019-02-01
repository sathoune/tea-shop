var express = require("express");
var router = express.Router({ mergeParams: true });
var MenuItem = require("../models/menu");

router.get("/", (req, res) => {
    MenuItem.find({}, (err, results) => {
      if(err){ console.log(err); }  
      else { res.render("index", {foundItems: results}); }
    });
});

module.exports = router;