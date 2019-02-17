const   express         = require("express"),
        Order           = require("../models/order"),
        OrderedItem     = require("../models/item"),
        pricesAndSums   = require("../functions/pricesAndSums"),
        dbFunctions     = require("../functions/dbFunctions"),
        router          = express.Router({ mergeParams: true });

router.post("/new", (req, res) => {
    Order.create({}, (err, createdOrder) => {
        if(err){ console.log(err);} 
        else { res.send(createdOrder); }
    });
});

router.post("/edit/table", (req, res) => {
    let promisedOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {table: req.body.table});
    promisedOrder.then( () => { res.send("Done");});
});

router.post("/edit/sum", (req, res) => {
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body._id);
    promisedOrder.then( (order) => {
        var promisedItems = order.orderedItems.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
        }, []);
        Promise.all(promisedItems).then( items => { 
            order.sum = pricesAndSums.calculateSum(items);
            order.save( () => { res.send({ sum: order.sum }); });
        });
    });
});

//similar to sum
router.post("/edit/discounted-sum", (req, res) => {
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body._id);
    promisedOrder.then( (order) => {
        var promisedItems = order.orderedItems.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
        }, []);
        Promise.all(promisedItems).then( items => { 
            order.discountedSum = pricesAndSums.calculateSum(items, "discountedPrice");
            order.save( () => { res.send({ discountedSum: order.discountedSum }) });
        });
    });
});

router.post("/edit/discount", (req, res) => {
    let promisedOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {discount: req.body.discount});
    promisedOrder.then((order) => { 
        var promisedItems = order.orderedItems.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
        }, []);
        Promise.all(promisedItems).then( (items) => { 
            var newDiscountedSum = items.reduce( (discountedSum, item) => {
                if(item.price){
                    item.discountedPrice = Number(item.price) * pricesAndSums.calculateDiscount(item, order);
                    discountedSum += Number(item.discountedPrice);
                    item.save();   
                }
                return discountedSum;
            }, 0); 
            order.discountedSum = newDiscountedSum;
            order.save( () => { res.send({ discountedSum: order.discountedSum, orderedItems: items }); });
        });
    });
});


// hardly different than above
router.post("/edit/discount-togo", (req, res) => {
    let promisedOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {discountToGo: req.body.discountToGo});
    promisedOrder.then((order) => { 
        var promisedItems = order.orderedItems.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
        }, []);
        Promise.all(promisedItems).then( (items) => { 
            var newDiscountedSum = items.reduce( (discountedSum, item) => {
                if(item.price){
                    item.discountedPrice = Number(item.price) * pricesAndSums.calculateDiscount(item, order);
                    discountedSum += Number(item.discountedPrice);
                    item.save();   
                }
                return discountedSum;
            }, 0); 
            order.discountedSum = newDiscountedSum;
            order.save( () => { res.send({ discountedSum: order.discountedSum, orderedItems: items }); });
        });
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
            updatedOrder.save( () => { res.send(updatedOrder._id); }); 
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
        promises.then(() => { res.send(openOrders); });
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

module.exports = router;