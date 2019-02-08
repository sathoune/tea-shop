var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");


router.post("/", (req, res) => {
    if(req.body.date){
        var now = new Date(req.body.date);
        var dateCriteria = {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1),
        };
        Order.find({createdAt: dateCriteria}, (err, foundOrders) => {
            if(err) { console.log(err);} 
            else {res.send(foundOrders);}
        });  
    } else { res.send(''); }
});

router.post("/show-ordered-items", (req,res) => {
    Order.findById(req.body, (err, foundOrder)=>{
       if(err){ console.log(err); } 
       else {
         OrderedItem.find({_id: { $in: foundOrder.orderedItems}}, 
         (err, foundItems) => {
           if(err) { console.log(err);} 
           else { res.send(foundItems); }
        });  
       }
    });
});

router.post("/reopen", (req, res) => {
    Order.findOneAndUpdate({_id: req.body._id}, {closed: false}, 
    (err) => {
       if(err) { console.log(err); }
       else { res.send('order reopened'); }
    });
    
});

module.exports = router;