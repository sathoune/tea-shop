const   express         = require("express"),
        Order           = require("../models/order"),
        Item            = require("../models/item"),
        Menu            = require("../models/menu"),
        dbFunctions     = require("../functions/dbFunctions"),
        uiDisplay       = require("../functions/uiDisplay"),
        router          = express.Router({ mergeParams: true });

router.post("/", (req, res) => {
    Menu.find({}, (err, menuItems) => {
       if(err){ console.log(err); }
       else{ 
            var names = menuItems.reduce((accumulator, menuItem) => {
                accumulator.names.push(menuItem.name);
                accumulator.count.push(0);
                return accumulator;
            }, {names: [], count: []});
            let promise = new Promise((resolve, reject) => {
            Order.find({}, (err, foundOrders) => {
                if(err){ reject(err); }
                else{ resolve(foundOrders) }
                });
            });
            promise.then((foundOrders) => {
               var itemIds = foundOrders.reduce((idArray, order) => {
                    return idArray.concat(order.items);
                }, []); 
                Item.find({'_id': { $in: itemIds}}, (err, foundItems)=> {
                    if(err){console.log(err);}
                    else {
                        let promises = foundItems.reduce((promiseChain, foundItem) => {
                            return promiseChain.then( () => new Promise( (resolve) => {
                               var itemIndex = names.names.indexOf(foundItem.name);
                                names.count[itemIndex] += 1; 
                                resolve();
                            }));
                        
                        }, Promise.resolve());
                        promises.then( () => { res.send(names)});
                        //res.send(names);
                    }                    
                });
            });
       }
    });
});

module.exports = router;