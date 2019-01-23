var express = require("express");
var app = express();
var mongoose = require("mongoose");
    
var dbURL =  "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected");
    }
});

app.set("view engine", "ejs");
app.get("/", function(req, res){
    res.send("hello");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The yelpcamp server is on"); 
});