var mongoose = require("mongoose");
var MenuItem = require("../models/menu.js");
var arrayOfMenuObjects = require("./openMenuFile");

function seedMenuDB() {
    MenuItem.deleteMany({}, function(err){
        if(err){
            console.log("something wrong:");
            console.log(err);
        } 
        console.log("Menu removed");
        console.log(arrayOfMenuObjects);
        arrayOfMenuObjects.forEach(function(menuObject){
            saveItemInDB(menuObject);
            });
        });
}

function saveItemInDB(item){
    MenuItem.create(item, (err, menuItem) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("Added menu position");
                    menuItem.save();
                }
});
}



module.exports = seedMenuDB;
