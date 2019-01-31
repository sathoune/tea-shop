var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var pricesAndSums = require("../functions/pricesAndSums");

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
                    var sum = pricesAndSums.calculateSum(orderedItems).toString();
                    var discountedSum = pricesAndSums.calculateDiscountedPricesForOrder(orderedItems, updatedOrder, OrderedItem).toString();
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

router.post("/edit-table", function(req,res){
 Order.findByIdAndUpdate({_id: req.body._id}, {table: req.body.table}, function(err){
  if(err){console.log(err); } 
  else { res.send("done");}
 });
});

router.post("/edit-sum", function(req, res){
 
  Order.find({_id: req.body._id}, function(err, foundOrder){
    if(err) { console.log(err); }
    else {
      foundOrder = foundOrder[0];
      OrderedItem.find({_id: {$in: foundOrder.orderedItems}}, function(err, foundItems){
        if(err) { console.log(err); }
        else {
          var sum = pricesAndSums.calculateSum(foundItems);
          Order.findByIdAndUpdate(
            {_id: foundOrder._id}, 
            {sum: sum},
            {new: true},
            function(err, updatedOrder){
              if(err) {console.log(err); }
              else { res.send({sum: updatedOrder.sum}); }
            });
        }
      });
    }
  });
});

router.post("/edit-discounted-sum", function(req, res){
  Order.findById({_id: req.body._id}, function(err, foundOrder){
    if(err) { console.log(err); }
    else {
      OrderedItem.find({_id: {$in: foundOrder.orderedItems}}, function(err, foundItems){
        if(err) { console.log(err); }
        else {
          var sum = pricesAndSums.calculateSum(foundItems, "discountedPrice");
          Order.findByIdAndUpdate(
            {_id: foundOrder._id}, 
            {discountedSum: sum},
            {new: true},
            function(err, updatedOrder){
              if(err) { console.log(err); }
              else { res.send({discountedSum: updatedOrder.discountedSum}); }
            });
        }
      });
    }
  });
});

router.post("/edit-discount", function(req, res) {
  Order.findByIdAndUpdate(
    {_id: req.body._id}, 
    {discount: req.body.discount},
    {new: true},
    function(err, updatedOrder){
      if(err) { console.log(err); 
      } else {
        OrderedItem.find({_id: {$in: updatedOrder.orderedItems}}, function(err, foundItems){
        if(err) { console.log(err); }
        else {
          var discountedSum = 0;
          var arrayOfPrices = [];
          foundItems.forEach(function(item){
            var newDiscountedPrice = item.price * pricesAndSums.calculateDiscount(item, updatedOrder);
            if(newDiscountedPrice){
              discountedSum += newDiscountedPrice;
            }
            OrderedItem.findOneAndUpdate(
              {_id: item._id}, 
              {discountedPrice: newDiscountedPrice});
            arrayOfPrices.push({item_id: item._id, discountedPrice: newDiscountedPrice});
          });
          Order.findByIdAndUpdate(
            {_id: updatedOrder._id}, 
            {discountedSum: discountedSum},
            {new: true},
            function(err, updatedOrder){
              if(err) { console.log(err); }
              else { res.send({discountedSum: updatedOrder.discountedSum, arrayOfPrices: arrayOfPrices}); }
            });
        }
      });
      }
    }); 
});

router.post("/edit-discount-togo", function(req, res) {
    Order.findByIdAndUpdate({_id: req.body._id}, 
    {discountToGo: req.body.discountToGo},
    {new: true},
    function(err, updatedOrder){
      if(err) { console.log(err); }
      else {
        OrderedItem.find({_id: {$in: updatedOrder.orderedItems}}, function(err, foundItems){
          if(err) { console.log(err); }
          else {
            var discountedSum = 0;
            var arrayOfPrices = [];

            foundItems.forEach(function(item){
              var newDiscountedPrice = item.price * pricesAndSums.calculateDiscount(item, updatedOrder);
              if(newDiscountedPrice){
                discountedSum += newDiscountedPrice;
              }
              arrayOfPrices.push({item_id: item._id, discountedPrice: newDiscountedPrice});
              OrderedItem.findOneAndUpdate({_id: item._id}, {discountedPrice: newDiscountedPrice});
            });
            Order.findByIdAndUpdate(
            {_id: updatedOrder._id}, 
            {discountedSum: discountedSum},
            {new: true},
            function(err, updatedOrder){
              if(err) { console.log(err); }
              else { res.send({discountedSum: updatedOrder.discountedSum, arrayOfPrices: arrayOfPrices}); }
            });
            
          }
        });
      }
    });
});

router.post('/close', function(req, res) {
    Order.findById({_id: req.body._id}, function(err, foundOrder){
      if(err) { console.log(err);
      } else {
        var arrayOfItems = foundOrder.orderedItems
        OrderedItem.find({_id: {$in: arrayOfItems}}, function(err, foundItems){
        if(err) { console.log(err); 
        } else {
          foundItems.forEach(function(item){
            if(item.name == ""){
              var index = arrayOfItems.indexOf(item._id);
              if(index > -1){
                arrayOfItems.splice(index, 1);
              }
              OrderedItem.findOneAndDelete({_id: item._id}, function(err){
                if(err){console.log(err);}
              });
            }
          });
          Order.findByIdAndUpdate({_id: req.body._id}, 
          {closed: true, orderedItems: arrayOfItems}, 
          {new: true},
          function(err, updatedOrder){
            if(err){ console.log(err);
            } else {
              res.send(updatedOrder._id);
            }
          });
        }
          
        });  
      }
      
  });
});

module.exports = router;