var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
var MenuItem = require("../models/menu");
var pricesAndSums = require("../functions/pricesAndSums");
const dbFunctions = require("../functions/dbFunctions");

router.post("/new", (req, res) => {
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderID);
    promisedOrder.then((order) => {
        OrderedItem.create({}, (err, createdItem) => {
        if(err){ console.log(err); } 
        else {
            order.orderedItems.push(createdItem);
            order.save();
            res.send(createdItem);
        }
      });
    });
});

router.post("/show", (req, res) => {
    let promisedItem = dbFunctions.promiseToGetFromCollectionById(OrderedItem, req.body._id);
    promisedItem.then(item => { res.send(item); });
});


//could change to triple finding with promises;
router.post('/edit/name', (req,res) => {
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
                      var response = {
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
        } else { // when item not found
          OrderedItem.findOneAndUpdate({_id: req.body.item_id}, {name: "", price: "", discountedPrice: ""},
          (err) => {
            if(err) { console.log(err); }
            else {
              const response = {
                name: req.body.name, 
                price: "", 
                discountedPrice: "",
                registerCode: "",
                err: 'wrong name',
                };
              res.send(response); 
            }
          });
        }
      });
      }
});

router.post('/edit/type', (req, res) => {
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(OrderedItem, req.body.item_id, {type: req.body.type});
    promisedItem.then((item) => {
        let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.order_id);
        let promisedMenuItem = dbFunctions.promiseToGetFromCollectionByObject(MenuItem, {name: item.name});
        Promise.all([promisedOrder, promisedMenuItem]).then((data) => {
            const order = data[0];
            const menuItem = data[1];
            item.price = pricesAndSums.calculatePrice(menuItem, item);
            item.discountedPrice = item.price * pricesAndSums.calculateDiscount(item, order);
            item.save(() => {
               const response = {price: item.price, discountedPrice: item.discountedPrice};
               res.send(response); 
            });
        });
    });
});
// very much the same as type
router.post('/edit/quantity', (req, res) => {
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(OrderedItem, req.body.item_id, {quantity: req.body.quantity});
    promisedItem.then((item) => {
        let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.order_id);
        let promisedMenuItem = dbFunctions.promiseToGetFromCollectionByObject(MenuItem, {name: item.name});
        Promise.all([promisedOrder, promisedMenuItem]).then((data) => {
            const order = data[0];
            const menuItem = data[1];
            item.price = pricesAndSums.calculatePrice(menuItem, item);
            item.discountedPrice = item.price * pricesAndSums.calculateDiscount(item, order);
            item.save(() => {
               const response = {price: item.price, discountedPrice: item.discountedPrice};
               res.send(response); 
            });
        });

    });
});


// dis not work
router.post("/edit/price", (req, res) => {
    let promiseItem = new Promise( (resolve) => {
        OrderedItem.findOneAndUpdate({_id: req.body.item_id}, {price: req.body.price}, () => {resolve();});
    });
    let promiseOrder = new Promise( (resolve) => {
    Order.findById({_id: req.body.order_id}, (err, foundOrder) => {
        if(err){ console.log(err); }
        else {resolve(foundOrder); }
        });
    });
  
    promiseItem.then( () => {promiseOrder.then( (order) => {
        OrderedItem.find({_id: {$in: order.orderedItems}}, (err, foundItems) => {
            if(err){ console.log(err); }
            else {
                var newSum = 0;
                let promises = foundItems.reduce((promiseChain, item) => {
                    return promiseChain.then( () => new Promise( (resolve) => {
                        if(item.price){
                            newSum += Number(item.price);
                        }
                        resolve();
                        }));
                    }, Promise.resolve());
                    promises.then( () => {
                    order.sum = newSum;
                    order.save();
                    res.send(order);
                    });  
            }
            });
        });
    });
});

router.post("/delete", (req, res) => {
    Order.find({orderedItems: req.body._id}, (err, foundOrder) => {
        if(err) { console.log(err); }
        else {
            var indexOfDeletedItem = foundOrder[0].orderedItems.indexOf(req.body._id);
            foundOrder[0].orderedItems.splice(indexOfDeletedItem, 1);
            foundOrder[0].save();
            OrderedItem.findOneAndDelete({_id: req.body._id}, (err) => {
                if(err) { console.log(err); }
                else { res.send('item deleted'); }
            });
        }
    });
});

module.exports = router;