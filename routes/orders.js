const   express         = require("express"),
        Order           = require("../models/order"),
        Item            = require("../models/item"),
        pricesAndSums   = require("../functions/pricesAndSums"),
        dbFunctions     = require("../functions/dbFunctions"),
        uiDisplay       = require("../functions/uiDisplay"),
        router          = express.Router({ mergeParams: true });

router.post("/new", (req, res) => {
    Order.create({}, (err, createdOrder) => {
        if(err){ console.log(err);} 
        else { res.send(createdOrder); }
    });
});

router.post("/edit/table", (req, res) => {
    let promisedOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {table: req.body.table});
    promisedOrder.then( () => { 
        res.send(uiDisplay.positionTable(req.body.table));
        
    });
});

router.post("/edit/sum", (req, res) => {
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body._id);
    promisedOrder.then( (order) => {
        var promisedItems = order.items.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
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
        var promisedItems = order.items.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
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
        var promisedItems = order.items.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
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
            order.save( () => { res.send({ discountedSum: order.discountedSum, items: items }); });
        });
    });
});


// hardly different than above
router.post("/edit/discount-togo", (req, res) => {
    let promisedOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {discountToGo: req.body.discountToGo});
    promisedOrder.then((order) => { 
        var promisedItems = order.items.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
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
            order.save( () => { res.send({ discountedSum: order.discountedSum, items: items }); });
        });
    });
});

router.post('/close' , (req, res) => {
  let promiseToUpdateOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {closed: true});
  promiseToUpdateOrder.then( (updatedOrder) => {
    const items = updatedOrder.items;
    let promisedItems = items.reduce( (promisedItems, item) => {
      return promisedItems.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
    }, []);
    Promise.all(promisedItems).then( (items) => {
        var notEmptyItems = items.reduce( (notEmptyItems, orderedItem) => {
            if(orderedItem.name){ notEmptyItems.push(orderedItem._id); }
            else { dbFunctions.promiseToDeleteFromCollectionById(Item, orderedItem._id).then();}
            return notEmptyItems;        
        }, []);
        if(notEmptyItems[0]){
            updatedOrder.items = notEmptyItems;
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
        var tableProperties = [];
        let promises = openOrders.reduce((promiseChain, order) => {
            return promiseChain.then( () => new Promise( (resolve) => {
                if(order.sum == "0"){
                    Order.findOneAndDelete({_id: order._id}, (err) => { if(err){ console.log(err); }});
                    openOrders.splice(openOrders.indexOf(order), 1);
                    resolve();
                } else { 
                    tableProperties.push(uiDisplay.positionTable(order.table));
                    resolve(); 
                }
        }));
        }, Promise.resolve());
        promises.then(() => { res.send({orders: openOrders, tableProperties}); });
    }
  });
});

router.post("/delete", (req, res) => {
    let promiseOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body._id);
    promiseOrder.then( (order) => {
        let deleteOrder = dbFunctions.promiseToDeleteFromCollectionById(Order, order._id);
        var deleteItem = [];
        order.items.forEach( (item) => {
            deleteItem += dbFunctions.promiseToDeleteFromCollectionById(Item, item._id);
    });
    Promise.all([deleteItem, deleteOrder]).then( () => { res.send('order deleted');});
    });
});

module.exports = router;