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
    Order.findByIdAndUpdate(
        {_id: req.body.orderID}, 
        req.body.values, 
        {new: true}, 
        function(err, updatedOrder){
            if(err){
                
                console.log(err);
                
            } else {
                
            OrderedItem.find(
            {_id: { $in: updatedOrder.orderedItems}}, 
            function(err, orderedItems){
                if(err){
                    console.log(err);
                } else {
                    var sum = calculateSum(orderedItems).toString();
                    var discountedSum = calculateDiscountedSum(orderedItems, updatedOrder).toString();
                    Order.findByIdAndUpdate({_id: req.body.orderID }, 
                    {sum: sum, discountedSum: discountedSum}, {new: true}, 
                    function(err, updatedOrder){
                        if(err){
                            console.log(err);
                        } else {
                            res.send({sum: updatedOrder.sum, discountedSum: updatedOrder.discountedSum});    
    
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

function calculateDiscountedSum(orderedItems, order){
    
    if(order.discount){
        if(order.discountToGo){
            return calculateSum(orderedItems) * (100-Number(order.discount)*0.01);
        } else {
            
            var discountedSum = 0;        
            orderedItems.forEach(function(item){
               if(item.price){
                   if(item.type == "opakowanie" || item.type == "gram"){
                       discountedSum += Number(item.price);
                   } else {
                       discountedSum += Number(item.price) * (100-Number(order.discount))*0.01;
                   }

               } 
               
            });
            return discountedSum;
        }
    } else {
        return calculateSum(orderedItems);
    }
}

module.exports = router;