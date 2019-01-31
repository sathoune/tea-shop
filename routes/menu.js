var express = require("express");
var router = express.Router({ mergeParams: true });
var MenuItem = require("../models/menu");


router.post("/", function(req,res){
    MenuItem.find({}, function(err, menu){
        if(err) { console.log(err);
        } else {
            res.send(menu);
        }
        
    })
})

module.exports = router;