var express = require("express");
var router = express.Router({ mergeParams: true });
var Order = require("../models/order");
var OrderedItem = require("../models/orderedItem");
const dbFunctions = require("../functions/dbFunctions");


router.post("/", (req, res) => {
    if(req.body.date){
        var now = new Date(req.body.date);
        var dateCriteria = {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1),
        };
        Order.find({createdAt: dateCriteria}, (err, foundOrders) => {
            if(err) { console.log(err);} 
            else {res.send(foundOrders);}
        });  
    } else { res.send(''); }
});

router.post("/show-ordered-items", (req, res) => {
    let promisedOrder = dbFunctions.promiseToGetFromCollectionById(Order, req.body._id);
    promisedOrder.then( (order) => {
       let promisedItems = order.orderedItems.reduce( (promisedItems, item) => {
           return promisedItems.concat(dbFunctions.promiseToGetFromCollectionById(OrderedItem, item));
       }, []); 
       Promise.all(promisedItems).then((items) => {res.send(items);});
    });
});

router.post("/reopen", (req, res) => {
    let promisedOrder = dbFunctions.promiseToUpdateFromCollectionById(Order, req.body._id, {closed: false});
    promisedOrder.then( () => { res.send("order opened"); });
});

module.exports = router;