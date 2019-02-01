var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var MenuItem = require("../models/menu");
var pricesAndSums = require("../functions/pricesAndSums");




router.post("/new", (req, res) => {
  Order.findById(req.body.orderID, (err, foundOrder) => {
    if(err){console.log(err);} 
    else {
      OrderedItem.create({}, (err, createdItem) => {
        if(err){console.log(err);} 
        else {
            foundOrder.orderedItems.push(createdItem);
            foundOrder.save();
            res.send(createdItem);
        }
      });
    }
  });
});

router.post("/show", (req, res) =>
{
  OrderedItem.findById({_id: req.body._id}, (err, foundItem) => {
    if(err) { console.log(err); }
    else { res.send(foundItem); } 
  });
});

router.post('/update-name', (req,res) => {
  MenuItem.findOne({name: { $regex: new RegExp(req.body.name,  "i")}}, 
  (err, foundMenuItem) => {
    if(err){ console.log(err);} 
    else if(foundMenuItem){
      OrderedItem.findOneAndUpdate(
      { _id: req.body.item_id}, {name: foundMenuItem.name}, {new: true}, 
      (err, updatedItem) => {
        if(err){console.log(err);} 
        else {
          var calculatedPrice = pricesAndSums.calculatePrice(foundMenuItem, updatedItem);
          Order.findById({_id: req.body.order_id}, 
          (err, foundOrder) => {
            if(err) { console.log(err); } 
            else {
              var discountedPrice = calculatedPrice * pricesAndSums.calculateDiscount(updatedItem, foundOrder);
              OrderedItem.findOneAndUpdate(
              {_id: updatedItem._id}, 
              {price: calculatedPrice, discountedPrice: discountedPrice},{new: true}, 
              (err, updatedItem) => {
                if(err){console.log(err);} 
                else {  
                  var response= { 
                    name: updatedItem.name, 
                    price: updatedItem.price, 
                    registerCode: foundMenuItem.registerCode,
                    discountedPrice: updatedItem.discountedPrice,
                  };
                  res.send(response);
                } 
              });
            }
          })
        }
      });
    } else { res.send(""); } // when item not found
  });
});

router.post('/update-type', (req,res) => {
  OrderedItem.findOneAndUpdate(
    { _id: req.body.item_id}, {type: req.body.type}, {new: true}, 
    (err, updatedItem) => {
      if(err){console.log(err); }
      else {
        MenuItem.findOne({name: updatedItem.name}, (err, menuItem) => {
          if(err) { console.log(err); }
          else if(menuItem){
            var newPrice = pricesAndSums.calculatePrice(menuItem, updatedItem);
            Order.findById({_id: req.body.order_id}, (err, foundOrder) => {
              if(err) { console.log(err);} 
              else {
              var discountedPrice = newPrice * pricesAndSums.calculateDiscount(updatedItem, foundOrder);
              OrderedItem.findOneAndUpdate(
                { _id: updatedItem._id}, 
                {price: newPrice, discountedPrice: discountedPrice,},{new: true},
                (err, updatedItem) => {
                  if(err) { console.log(err); }
                  else {
                    var response = {price: updatedItem.price, discountedPrice: updatedItem.discountedPrice};
                    res.send(response);
                  }
                });
              }
            });
          } else {res.send({price: "0"}); } // When item not found
        });
      }
    });
});

router.post('/update-quantity', (req,res) => {
  OrderedItem.findOneAndUpdate(
  { _id: req.body.item_id}, {quantity: req.body.quantity}, {new: true}, 
  (err, updatedItem) => {
    if(err){ console.log(err); } 
    else {
      MenuItem.findOne({name: updatedItem.name}, (err, menuItem) => {
        if(err) { console.log(err); } 
        else if(menuItem){
          var newPrice = pricesAndSums.calculatePrice(menuItem, updatedItem);
          Order.findById({_id: req.body.order_id}, (err, foundOrder) => {
            if(err) { console.log(err);} 
            else {
              var discountedPrice = newPrice * pricesAndSums.calculateDiscount(updatedItem, foundOrder);
              OrderedItem.findOneAndUpdate(
                { _id: updatedItem._id}, 
                {price: newPrice,discountedPrice: discountedPrice,},{new: true},
                (err, updatedItem) => {
                  if(err) { console.log(err);
                  } else {
                    var respone = {price: updatedItem.price, discountedPrice: updatedItem.discountedPrice };
                    res.send(respone);
                  }
                });
            }
          });
        } else {res.send({price: "0"}); }             // When item not found
      });
    }
  });
});

module.exports = router;