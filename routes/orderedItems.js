var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var MenuItem = require("../models/menu");
var pricesAndSums = require("../functions/pricesAndSums");




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
    MenuItem.findOne(
        {name: { $regex: new RegExp(req.body.name,  "i")}}, 
        function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            if(foundItem){
                Order.findById({_id: req.body.orderID}, function(err, foundOrder){
                    if(err){
                        console.log(err);
                    } else {
                        var calculatedPrice = pricesAndSums.calculatePrice(foundItem, req.body);
                        var discount = pricesAndSums.calculateDiscount(req.body, foundOrder);
                        OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                                    name: foundItem.name,
                                    quantity: req.body.quantity,
                                    type: req.body.type,
                                    price: calculatedPrice,
                                    discountedPrice: calculatedPrice*discount,
                                }, 
                                {new: true},
                                function(err, updatedItem){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        OrderedItem.find({_id: {$in: foundOrder.orderedItems}},
                                        function(err, orderedItems){
                                            if(err){
                                                console.log(err);
                                            } else {
                                                var data = {
                                            itemData: {
                                                name: updatedItem.name, 
                                                price: updatedItem.price, 
                                                registerCode: foundItem.registerCode, 
                                                discountedPrice: updatedItem.discountedPrice},
                                                
                                            orderData: {
                                                sum: pricesAndSums.calculateSum(orderedItems).toString(),
                                                discountedSum: pricesAndSums.calculateDiscountedSum(orderedItems).toString()
                                            }
                                            };
                                            Order.findOneAndUpdate({_id: req.body.orderID}, data.orderData, {new: true},function(err){
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    res.send(data);
                                                }
                                            });
                                            }
                                            
                                           
                                            
                                        });
                                       
                                    }
                                    
                                });
                    }
                });
                
            } else {
                OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                    name: '',
                    quantity: '',
                    type: 'default',
                    price: '',
                    discountedPrice: '',
                    
                }, function(){
                    res.send({price: 0, registerCode: 0, discountedPrice: 0});
                });
            } 
        }
    });
    
});

router.post('/update-name', function(req,res){
    MenuItem.findOne({name: { $regex: new RegExp(req.body.name,  "i")}}, function(err, foundMenuItem){
        if(err){
            console.log(err);
        } else if(foundMenuItem){
          
            OrderedItem.findOneAndUpdate(
                { _id: req.body.item_id}, 
                {name: foundMenuItem.name}, 
                {new: true}, function(err, updatedItem){
                  if(err){
                    console.log(err);
                  } else {
                    var calculatedPrice = pricesAndSums.calculatePrice(foundMenuItem, updatedItem)
                    OrderedItem.findOneAndUpdate(
                      {_id: updatedItem._id}, 
                      {price: calculatedPrice},
                      {new: true}, 
                      function(err, updatedItem){
                        if(err){
                          console.log(err);
                        } else {  
                          var response= { name: updatedItem.name, price: updatedItem.price, registerCode: foundMenuItem.registerCode};
                          res.send(response);
                        } 
                      });
                  }
                });
                
        } else {
          // if name not found
          res.send("");
        }
    });
});

router.post('/update-type', function(req,res){
  OrderedItem.findOneAndUpdate(
    { _id: req.body.item_id}, 
    {type: req.body.type}, 
    {new: true}, 
    function(err, updatedItem){
      if(err){console.log(err); }
      else {
        MenuItem.findOne({name: updatedItem.name}, function(err, menuItem){
          if(err) { console.log(err); }
          else if(menuItem){
            var newPrice = pricesAndSums.calculatePrice(menuItem, updatedItem);
            OrderedItem.findOneAndUpdate(
              { _id: updatedItem._id}, 
              {price: newPrice}, 
              {new: true},
              function(err, updatedItem){
                if(err) { console.log(err); }
                else {
                  res.send(updatedItem);
                }
              });
          } else {
            // When item not found
            res.send(updatedItem);
          }
        });
        
      }
    });
});

router.post('/update-quantity', function(req,res){
  OrderedItem.findOneAndUpdate(
    { _id: req.body.item_id}, 
    {quantity: req.body.quantity}, 
    {new: true}, 
    function(err, updatedItem){
      if(err){  console.log(err); }
      else {
        MenuItem.findOne({name: updatedItem.name}, function(err, menuItem){
          if(err) { console.log(err); }
          else if(menuItem){
            var newPrice = pricesAndSums.calculatePrice(menuItem, updatedItem);
            OrderedItem.findOneAndUpdate(
              { _id: updatedItem._id}, 
              {price: newPrice}, 
              {new: true},
              function(err, updatedItem){
                if(err) { console.log(err); }
                else {
                  res.send(updatedItem);
                }
              });
          } else {
            // When item not found
            res.send(updatedItem);
          }
        });
        
      }
    });
});

module.exports = router;