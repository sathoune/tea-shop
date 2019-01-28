var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");


router.post("/new", function(req, res){
    Order.create({}, function(err, createdOrder){
        if(err){
            console.log(err);
        } else {
            res.send(createdOrder);
        }
    });
});

router.post("/edit", function(req, res){
    Order.findByIdAndUpdate({_id: req.body.orderID}, req.body.values, {new: true}, function(err, updatedOrder){
        if(err){
            console.log(err);
        } else {
        OrderedItem.find(
        {_id: { $in: updatedOrder.orderedItems}}, 
        function(err, orderedItems){
            if(err){
                console.log(err);
            } else {
                var sum =calculateSum(orderedItems).toString();
                Order.findByIdAndUpdate({_id: req.body.orderID }, 
                {sum: sum}, {new: true}, 
                function(err, updatedOrder){
                    if(err){
                        console.log(err);
                    } else {
                        res.send(updatedOrder.sum);    

                    }
                });
                
            }
    
        });
            
        }
    });
   
});


function calculateSum(orderedItems){
    var sum = 0; 
         
    orderedItems.forEach(function(item){
        if(item.price){
            sum+=Number(item.price);
        }
    });
    return sum;
}

module.exports = router;