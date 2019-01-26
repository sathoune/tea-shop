var MenuItem = require("../models/menu.js");

function findMatchingItems(name, makeSomethingWithData){
    var results = [];
    MenuItem.find({name: new RegExp('.*'+name+'.*', "i")}, 
    function(err, matchingItems){
        if(err){
          console.log(err);  
        } else {
           makeSomethingWithData(matchingItems);
        }
    });
    
}
module.exports = findMatchingItems;
