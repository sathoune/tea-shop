var MenuItem = require("../models/menu.js");

function findMatchingItems(name, res){
    var results = [];
    MenuItem.find({name: new RegExp('.*'+name+'.*', "i")}, 
    function(err, matchingItems){
        if(err){
          console.log(err);  
        } else {
           res.send(matchingItems);
        }
    });
    
}
module.exports = findMatchingItems;
