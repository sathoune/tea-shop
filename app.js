var express = require("express");
var app = express();
var mongoose = require("mongoose");
    
var dbURL =  "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.render("index");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The tea-shop server is on"); 
});