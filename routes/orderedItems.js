const   express         = require("express"),
        Order           = require("../models/order"),
        OrderedItem     = require("../models/orderedItem"),
        MenuItem        = require("../models/menu"),
        pricesAndSums   = require("../functions/pricesAndSums"),
        dbFunctions     = require("../functions/dbFunctions"),
        router          = express.Router({ mergeParams: true });
        
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

router.post('/edit/name', (req, res) => {
    var promisedItem = dbFunctions.promiseToGetFromCollectionById(OrderedItem, req.body.item_id);
    if(req.body.name == ''){
        promisedItem.then( (item) => {
            item.name = "";
            item.price = "";
            item.discountedPrice = "";
            item.save( () => {
                const response = {
                    name: "", 
                    price: "", 
                    discountedPrice: "",
                    registerCode: "",
                };
            res.send(response);                
            });
        });
    } else {
        let promisedMenuItem = new Promise( (resolve, reject) => {
            MenuItem.findOne({name: { $regex: new RegExp(req.body.name,  "i")}}, (err, foundMenuItem) => {
                if(err){ reject(err); }
                else{ resolve(foundMenuItem); }
            }); 
        });
        let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.order_id);
        Promise.all([promisedItem, promisedOrder, promisedMenuItem]).then( (values) => {
            let item = values[0],
                order = values[1],
                menuItem = values[2];
            if(menuItem){
               item.name = menuItem.name;
                item.price = pricesAndSums.calculatePrice(menuItem, item);
                item.discountedPrice = item.price * pricesAndSums.calculateDiscount(item, order);
                item.save( () => {
                    var response = {
                            name: item.name, 
                            price: item.price, 
                            discountedPrice: item.discountedPrice,
                            registerCode: menuItem.registerCode,
                        };
                    res.send(response);
                }); 
            } else {
                item.name = "";
                item.price = "";
                item.discountedPrice = "";
                item.save( () => {
                    const response = {
                        name: "", 
                        price: "", 
                        discountedPrice: "",
                        registerCode: "",
                        err: "wrong name",
                    };
                res.send(response);                
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

router.post("/edit/price", (req, res) => {
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(OrderedItem, req.body.itemId, {price: req.body.price});
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderId);
    Promise.all([promisedOrder, promisedItem]).then(promisedValues => {
        let order = promisedValues[0];
        let item = promisedValues[1];
        item.discountedPrice = item.price * pricesAndSums.calculateDiscount(item, order);
        item.save();
        var promisedItems = order.orderedItems.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
        }, []);
        Promise.all(promisedItems).then((items) => {
            order.sum = pricesAndSums.calculateSum(items); 
            order.discountedSum = pricesAndSums.calculateSum(items, "discountedPrice"); 
            order.save( () => { res.send({order: order, item: item }); });
        });
    });
});

router.post("/edit/discounted-price", (req, res) => {
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(OrderedItem, req.body.itemId, {discountedPrice: req.body.discountedPrice});
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderId);
    Promise.all([promisedOrder, promisedItem]).then(promisedValues => {
        let order = promisedValues[0];
        let item = promisedValues[1];
        var promisedItems = order.orderedItems.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
        }, []);
        Promise.all(promisedItems).then((items) => {
            order.discountedSum = pricesAndSums.calculateSum(items, "discountedPrice"); 
            order.save( () => { res.send({order: order, item: item }); });
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