var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var pricesAndSums = require("../functions/pricesAndSums");

router.post("/new", (req, res) => {
    Order.create({}, (err, createdOrder) => {
        if(err){ console.log(err);} 
        else { res.send(createdOrder); }
    });
});



router.post("/edit/table", (req,res) => {
 Order.findByIdAndUpdate({_id: req.body._id}, {table: req.body.table}, 
 (err) => {
  if(err){console.log(err); } 
  else { res.send("done");}
 });
});

router.post("/edit/sum", (req, res) => {
  Order.findOne({_id: req.body._id}, (err, foundOrder) => {
    if(err) { console.log(err); }
    else {
      OrderedItem.find({_id: {$in: foundOrder.orderedItems}}, (err, foundItems) =>{
        if(err) { console.log(err); }
        else {
          var sum = pricesAndSums.calculateSum(foundItems);
          foundOrder.sum = sum;
          foundOrder.save( (err) => {
            if(err) { console.log(err); }
            else {res.send({sum: foundOrder.sum}); }
          });
        }
      });
    }
  });
});

router.post("/edit/discounted-sum", (req, res) => {
  Order.findById({_id: req.body._id}, (err, foundOrder) => {
    if(err) { console.log(err); }
    else {
      OrderedItem.find({_id: {$in: foundOrder.orderedItems}}, 
      (err, foundItems) => {
        if(err) { console.log(err); }
        else {
          var sum = pricesAndSums.calculateSum(foundItems, "discountedPrice");
          foundOrder.discountedSum = sum;
          foundOrder.save( (err) => {
            if(err) { console.log(err); }
            else {res.send({discountedSum: foundOrder.discountedSum}); }
          });
        }
      });
    }
  });
});

router.post("/edit/discount", (req, res) => {
  Order.findByIdAndUpdate(
    {_id: req.body._id},{discount: req.body.discount}, {new: true},
    (err, updatedOrder) => {
      if(err) { console.log(err);} 
      else {
        OrderedItem.find({_id: {$in: updatedOrder.orderedItems}}, 
        (err, foundItems) => {
        if(err) { console.log(err); }
        else {
          updatedOrder.discountedSum = 0;
          let promises = foundItems.reduce((promiseChain, item) => {
            return promiseChain.then( () => new Promise( (resolve) => {
              if(item.discountedPrice) { 
                var newDiscountedPrice = item.price * pricesAndSums.calculateDiscount(item, updatedOrder);
                updatedOrder.discountedSum = Number(updatedOrder.discountedSum) + newDiscountedPrice; 
                item.discountedPrice = newDiscountedPrice;
              } 
              item.save( (err) => {
                if(err) { console.log(err); }
                else { resolve(); }
              });
            }));
          }, Promise.resolve());
          promises.then(() => {
            updatedOrder.save( (err) => {
              if (err) { console.log(err); }
              else {res.send({discountedSum: updatedOrder.discountedSum, orderedItems: foundItems}); }
            });  
          });
        }
      });
    }
  }); 
});

router.post("/edit/discount-togo", (req, res) => {
    Order.findByIdAndUpdate({_id: req.body._id}, {discountToGo: req.body.discountToGo}, {new: true},
    (err, updatedOrder) => {
      if(err) { console.log(err); }
      else {
        OrderedItem.find({_id: {$in: updatedOrder.orderedItems}}, 
        (err, foundItems) =>{
          if(err) { console.log(err); }
          else {
            
            
            // SAME CODE AS ABOVE, CHANGE DIS
            
            
            
            updatedOrder.discountedSum = 0;
          let promises = foundItems.reduce((promiseChain, item) => {
            return promiseChain.then( () => new Promise( (resolve) => {
              if(item.discountedPrice) { 
                var newDiscountedPrice = item.price * pricesAndSums.calculateDiscount(item, updatedOrder);
                updatedOrder.discountedSum = Number(updatedOrder.discountedSum) + newDiscountedPrice; 
                item.discountedPrice = newDiscountedPrice;
              } 
              item.save( (err) => {
                if(err) { console.log(err); }
                else { resolve(); }
              });
            }));
          }, Promise.resolve());
          promises.then(() => {
            updatedOrder.save( (err) => {
              if (err) { console.log(err); }
              else {res.send({discountedSum: updatedOrder.discountedSum, orderedItems: foundItems}); }
            });  
          });
          }
        });
      }
    });
});

router.post('/close' , (req, res) => {
  Order.findByIdAndUpdate({_id: req.body._id }, {closed: true}, {new: true}, 
  (err, updatedOrder) =>{
    if(err) { console.log(err); }
    else {
      const promise = new Promise( (resolve, reject) => {
        OrderedItem.find({_id: {$in: updatedOrder.orderedItems}}, (err, foundItems) => {
          foundItems.forEach( (item) => {
            if(item.name == ""){
              var index = updatedOrder.orderedItems.indexOf(item._id);
              if(index > -1){ updatedOrder.orderedItems.splice(index, 1); }
              OrderedItem.deleteOne({_id: item._id}, (err) => {
                if(err) {console.log(err)}
                else {
                  resolve('order closed');
                }
              });
            }
          });
        });
      });
      promise.then( (resolve) => {
        updatedOrder.save();
        res.send(updatedOrder._id);
      });
    }
  });
});

router.post("/old", (req, res) => { 
  Order.find({closed: false}, (err, openOrders) => { 
    if(err) { console.log(err); }
    else { res.send(openOrders); }
  });
});

router.post("/delete", (req, res) => {
  Order.findById(req.body._id, (err, foundOrder) => {
    var promise = new Promise((resolve, reject)=> {
      Order.findOneAndDelete({_id: req.body._id}, (err) => { if(err) { console.log(err); } });
      foundOrder.orderedItems.forEach(
        (orderedItem) => { OrderedItem.findOneAndDelete({_id: orderedItem}, (err) => { 
          if(err) { console.log(err) } 
          else { resolve(); };
        });
      });
    });
    promise.then((resolve) => { res.send("order deleted from db") } );
  });
});

module.exports = router;