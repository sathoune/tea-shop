var mongoose = require("mongoose");
console.log(require("./db_seeds/menuItems"));
    
var dbURL =  "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});