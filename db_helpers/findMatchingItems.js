var MenuItem = require("../models/menu.js");

function findMatchingItems(name){
 
    MenuItem.find({name: new RegExp('.*'+name+'.*', "i")}, function(err, foundItem){
        if(err){
          console.log(err);  
        } else {
            console.log("I am here");
            console.log(foundItem);
        }
        
        
});
   
}
module.exports = findMatchingItems;
