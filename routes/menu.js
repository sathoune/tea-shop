var express = require("express");
var router = express.Router({ mergeParams: true });
var MenuItem = require("../models/menu");


router.post("/", function(req,res){
    MenuItem.find({}, function(err, menu){
        if(err) { console.log(err);
        } else {
            res.send(menu);
        }
        
    });
});

router.post("/edit", function(req,res){
    MenuItem.findOneAndUpdate({_id: req.body._id}, req.body.newData, function(err){
       if(err) { console.log(err);
       } else {
           res.send("well played");
       }
    });
});

module.exports = router;