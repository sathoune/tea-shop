var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");


router.post("/", (req, res) => {
    Order.find({}, (err, foundOrders) => {
        if(err) { console.log(err);
        } else {
            res.send(foundOrders);
        }
    });
});

router.post("/show-ordered-items", function(req,res){
    Order.findById(req.body, (err, foundOrder)=>{
       if(err){ console.log(err);
       } else {
         OrderedItem.find({_id: { $in: foundOrder.orderedItems}}, (err, foundItems) => {
       
           if(err) { console.log(err);
           } else {
               res.send(foundItems);
           }
        });  
       }
    });
    
});

module.exports = router;