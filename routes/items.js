const   express         = require("express"),
        Order           = require("../models/order"),
        Item            = require("../models/item"),
        MenuItem        = require("../models/menu"),
        pricesAndSums   = require("../functions/pricesAndSums"),
        dbFunctions     = require("../functions/dbFunctions"),
        router          = express.Router({ mergeParams: true });
        
router.post("/new", (req, res) => {
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderID);
    promisedOrder.then((order) => {
        Item.create({}, (err, createdItem) => {
        if(err){ console.log(err); } 
        else {
            order.items.push(createdItem);
            order.save();
            res.send(createdItem);
        }
      });
    });
});

router.post("/show", (req, res) => {
    let promisedItem = dbFunctions.promiseToGetFromCollectionById(Item, req.body._id);
    promisedItem.then(item => { res.send(item); });
});

router.post('/edit/name', (req, res) => {
    let promisedItem = dbFunctions.promiseToGetFromCollectionById(Item, req.body.itemId);
    if(req.body.name == ''){
        promisedItem.then( (item) => {
            item = setMenuValuesIntoItem(item);
            item.save(() => { res.send({item}); });
        });
    } else {
        let promisedMenuItem = dbFunctions.promiseToFindMenuItem(MenuItem, req.body.name);
        let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderId);
        Promise.all([promisedItem, promisedOrder, promisedMenuItem]).then( (values) => {
            let item = values[0],
                order = values[1],
                menuItem = values[2];
            if(menuItem){
                item = setMenuValuesIntoItem(item, menuItem, order);
                item.save(() => { res.send({item}); }); 
            } else {
                item = setMenuValuesIntoItem(item);
                item.save(() => { res.send({item, err:"wrong name" }); });
            }
        });
    }
});

router.post('/edit/type', (req, res) => {
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(Item, req.body.item_id, {type: req.body.type});
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
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(Item, req.body.item_id, {quantity: req.body.quantity});
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
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(Item, req.body.itemId, {price: req.body.price});
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderId);
    Promise.all([promisedOrder, promisedItem]).then(promisedValues => {
        let order = promisedValues[0];
        let item = promisedValues[1];
        item.discountedPrice = item.price * pricesAndSums.calculateDiscount(item, order);
        item.save();
        var promisedItems = order.items.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
        }, []);
        Promise.all(promisedItems).then((items) => {
            order.sum = pricesAndSums.calculateSum(items); 
            order.discountedSum = pricesAndSums.calculateSum(items, "discountedPrice"); 
            order.save( () => { res.send({order: order, item: item }); });
        });
    });
});

router.post("/edit/discounted-price", (req, res) => {
    let promisedItem = dbFunctions.promiseToUpdateFromCollectionById(Item, req.body.itemId, {discountedPrice: req.body.discountedPrice});
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body.orderId);
    Promise.all([promisedOrder, promisedItem]).then(promisedValues => {
        let order = promisedValues[0];
        let item = promisedValues[1];
        var promisedItems = order.items.reduce((promises, item) => {
            return promises.concat(dbFunctions.promiseToGetFromCollectionById(Item, item));
        }, []);
        Promise.all(promisedItems).then((items) => {
            order.discountedSum = pricesAndSums.calculateSum(items, "discountedPrice"); 
            order.save( () => { res.send({order: order, item: item }); });
        });
    });
});

router.post("/delete", (req, res) => {
    Order.find({items: req.body._id}, (err, foundOrder) => {
        if(err) { console.log(err); }
        else {
            var indexOfDeletedItem = foundOrder[0].items.indexOf(req.body._id);
            foundOrder[0].items.splice(indexOfDeletedItem, 1);
            foundOrder[0].save();
            Item.findOneAndDelete({_id: req.body._id}, (err) => {
                if(err) { console.log(err); }
                else { res.send('item deleted'); }
            });
        }
    });
});

function setMenuValuesIntoItem(item, menuItem, order){
    if(menuItem && order){
        item.name = menuItem.name;
        item.registerCode = menuItem.registerCode;
        item.price = pricesAndSums.calculatePrice(menuItem, item);
        item.discountedPrice = item.price * pricesAndSums.calculateDiscount(item, order);
        return item;
    } else {
        item.name = "";
        item.registerCode = "";
        item.price = "";
        item.discountedPrice = "";
        return item;
    }
    
    
}
module.exports = router;