var express = require("express");
var router = express.Router({ mergeParams: true });
var MenuItem = require("../models/menu");

router.get("/", function(req, res){
    
    MenuItem.find({}, function(err, results){
      if(err){
          console.log(err);
      }  else {
          res.render("index", {foundItems: results});
      }
    });
    
});

module.exports = router;