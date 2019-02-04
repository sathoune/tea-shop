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


//could change to triple finding with promises;
router.post('/update-name', (req,res) => {
  if(req.body.name == ''){
    OrderedItem.findOneAndUpdate({_id: req.body.item_id}, {name: "", price: "", discountedPrice: "",},
    (err) => {
      if(err) { console.log(err); }
      else {
        const response = {
        name: "", 
        price: "", 
        discountedPrice: "",
        registerCode: "",
        };
      res.send(response);      
      }
        
  });
  } else {
  MenuItem.findOne({name: { $regex: new RegExp(req.body.name,  "i")}}, 
  (err, foundMenuItem) => {
    if(err){ console.log(err);} 
    else if(foundMenuItem){
      OrderedItem.findOneAndUpdate(
      { _id: req.body.item_id}, {name: foundMenuItem.name}, {new: true}, 
      (err, updatedItem) => {
        if(err){ console.log(err);} 
        else {
          updatedItem.price = pricesAndSums.calculatePrice(foundMenuItem, updatedItem);
          Order.findById({_id: req.body.order_id}, 
          (err, foundOrder) => {
            if(err) { console.log(err); } 
            else {
              updatedItem.discountedPrice = updatedItem.price * pricesAndSums.calculateDiscount(updatedItem, foundOrder);
              updatedItem.save( (err) => {
                if(err) { console.log(err); }
                else { 
                  response = {
                    name: updatedItem.name, 
                    price: updatedItem.price, 
                    discountedPrice: updatedItem.discountedPrice,
                    registerCode: foundMenuItem.registerCode,
                  }
                  res.send(response);
                  
                }
              });
            }
          });
        }
      });
    } else { res.send(""); } // when item not found
  });
  }
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

router.post("/delete", (req,res)=>{
  Order.find({orderedItems: req.body._id}, (err, foundOrder) => {
    if(err) { console.log(err); }
    else {
      var indexOfDeletedItem = foundOrder[0].orderedItems.indexOf(req.body._id);
      foundOrder[0].orderedItems.splice(indexOfDeletedItem, 1);
      foundOrder[0].save();
      
      OrderedItem.findOneAndDelete({_id: req.body._id}, (err)=>{
        if(err) { console.log(err); }
        else { res.send('item deleted'); }
        });
    }
  });
  
});

module.exports = router;