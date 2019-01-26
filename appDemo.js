var mongoose = require("mongoose");
var seedMenu = require("./db_seeds/seedMenuItems");
var findMatchingItems = require("./db_helpers/findMatchingItems");
var dbURL =  "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});

console.log(findMatchingItems("shan"));
//seedMenu();