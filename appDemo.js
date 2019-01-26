var mongoose = require("mongoose");
var seedMenu = require("./db_seeds/seedMenuItems");
    
var dbURL =  "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});

seedMenu();