var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var MenuItem = require("../models/menu");




router.post("/new", function(req, res){
    Order.findById(req.body.orderID, function(err, foundOrder){
        if(err){
            console.log(err);
        } else {
            OrderedItem.create({}, function(err, createdItem){
            if(err){
                console.log(err);
            } else {
                foundOrder.orderedItems.push(createdItem);
                foundOrder.save();
                
                res.send(createdItem);
            }
            });
        }
    });
    
});

router.post("/edit", function(req, res){
    MenuItem.findOne({name: { $regex: new RegExp(req.body.name,  "i")}}, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            if(foundItem){
                var calculatedPrice = calculatePrice(foundItem, req.body);
                OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                    name: foundItem.name,
                    quantity: req.body.quantity,
                    type: req.body.type,
                    price: calculatedPrice,
                    
                }, 
                {new: true},
                function(err, updatedItem){
                    res.send({name: updatedItem.name, price: updatedItem.price, registerCode: foundItem.registerCode, discountedPrice: calculatedPrice});
                });
            } else {
                OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                    name: '',
                    quantity: '',
                    type: 'default',
                    price: '',
                    
                }, function(){
                    res.send({price: 0, registerCode: 0, discountedPrice: 0});
                });
            } 
        }
    });
    
});


function calculatePrice(menuObject, uiObject){
    var type = uiObject.type;
    var calculatedPrice;
    if(type == "sztuka" || type == "czajnik"){
	    calculatedPrice = menuObject.prices.default;
    }
    else if(type == "gaiwan"){
	    calculatedPrice = menuObject.prices.gaiwan;
    }
    else if(type == "opakowanie"){
        calculatedPrice = menuObject.prices.package;
    }
    else if(type == "gram"){
        calculatedPrice = menuObject.prices.bulk;
    }
    return calculatedPrice * uiObject.quantity;
}


module.exports = router;