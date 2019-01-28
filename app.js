var express = require("express");
var app = express();
var mongoose = require("mongoose");
var MenuItem = require("./models/menu");
var bodyParser = require("body-parser");
var OrderedItem = require("./models/orderedItem");
var Order = require("./models/order");
var orderRoutes = require("./routes/orders");
var orderedItemRoutes = require("./routes/orderedItems");
var seedMenu = require("./db_seeds/seedMenuItems");
//var findMatchingItems = require("./db_helpers/findMatchingItems");
var dbURL =  "mongodb://localhost:27017/tea-shop";

mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + "/public"));
app.use("/order", orderRoutes);
app.use("/ordered-item", orderedItemRoutes);

// app.get("/", function(req, res){
//     findMatchingItems("ass", res);
    
// });


app.get("/", function(req, res){
    
    MenuItem.find({}, function(err, results){
      if(err){
          console.log(err);
      }  else {
          res.render("index", {foundItems: results});
      }
    });
    
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The tea-shop server is on"); 
});
