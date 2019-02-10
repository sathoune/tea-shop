var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var pricesAndSums = require("../functions/pricesAndSums");
const dbFunctions = require("../functions/dbFunctions");

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
            
            
            // SAME CODE AS ABOVE FUNCTION, CHANGE DIS
            
            
            
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
  let promiseToUpdateOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {closed: true});
  promiseToUpdateOrder.then( (updatedOrder) => {
    const orderedItems = updatedOrder.orderedItems;
    let promisedItems = orderedItems.reduce( (promisedItems, item) => {
      return promisedItems.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
    }, []);
    Promise.all(promisedItems).then( (orderedItems) => {
        var notEmptyItems = orderedItems.reduce( (notEmptyItems, orderedItem) => {
            if(orderedItem.name){ notEmptyItems.push(orderedItem._id); }
            else { dbFunctions.promiseToDeleteFromCollectionById(OrderedItem, orderedItem._id).then();}
            return notEmptyItems;        
        }, []);
        if(notEmptyItems[0]){
            updatedOrder.orderedItems = notEmptyItems;
            updatedOrder.save(() => { res.send(updatedOrder._id); }); 
        } else {
            Order.findOneAndDelete({_id: updatedOrder._id}, () => { res.send(updatedOrder._id); });
        }
    });
  });
});

router.post("/old", (req, res) => { 
  Order.find({closed: false}, (err, openOrders) => { 
    if(err) { console.log(err); }
    else { 
        let promises = openOrders.reduce((promiseChain, order) => {
        return promiseChain.then( () => new Promise( (resolve) => {
            if(order.sum == '0'){
                Order.findOneAndDelete(order);
                openOrders.splice(openOrders.indexOf(order), 1);
            }
            resolve();
        }));
        }, Promise.resolve());
        promises.then(() => {res.send(openOrders); });
    }
  });
});

router.post("/delete", (req, res) => {
    let promiseOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body._id);
    promiseOrder.then( (order) => {
        let deleteOrder = dbFunctions.promiseToDeleteFromCollectionById(Order, order._id);
        var deleteItem = [];
        order.orderedItems.forEach( (item) => {
            deleteItem += dbFunctions.promiseToDeleteFromCollectionById(OrderedItem, item._id);
    });
    Promise.all([deleteItem, deleteOrder]).then( () => { res.send('order deleted');});
    });
});

router.post("/test", (req, res) => {
    var promiseOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderId);
    promiseOrder.then( (order) => {
        console.log(order.discount);
    });
});

module.exports = router;