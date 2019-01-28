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
    MenuItem.findOne({name: req.body.name}, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            if(req.body.name){
                var calculatedPrice = calculatePrice(foundItem, req.body);
                OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                    name: req.body.name,
                    quantity: req.body.quantity,
                    type: req.body.type,
                    price: calculatedPrice,
                    
                }, function(){
                    res.send({price: calculatedPrice, registerCode: foundItem.registerCode});
                });
            } else {
                OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                    name: '',
                    quantity: '',
                    type: 'default',
                    price: '',
                    
                }, function(){
                    res.send({price: 0, registerCode: 0});
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