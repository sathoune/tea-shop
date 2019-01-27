var express = require("express");
var app = express();
var mongoose = require("mongoose");
var MenuItem = require("./models/menu");
var bodyParser = require("body-parser");
var OrderedItem = require("./models/orderedItem");

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

app.post("/data", function(req,res){
    MenuItem.findOne({name: req.body.name}, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            res.send(foundItem);
            
            
        }
    });
});

app.post("/create-item", function(req, res){
    OrderedItem.create({}, function(err, createdItem){
        if(err){
            console.log(err);
        } else {
            res.send(createdItem);
        }
    })
})
app.post("/update-item", function(req, res){
    MenuItem.findOne({name: req.body.name}, function(err, foundItem){
        if(err){
            console.log(err);
        } else {
            var calculatedPrice = calculatePrice(foundItem, req.body);
            OrderedItem.findOneAndUpdate({_id: req.body.id}, {
                name: req.body.name,
                quantity: req.body.quantity,
                type: req.body.type,
                price: calculatedPrice,
                
            }, function(){
                res.send({price: calculatedPrice, registerCode: foundItem.registerCode});
            });
            
        }
    });
    
});

function calculatePrice(menuObject, uiObject){
    var type = uiObject.type;
    var calculatedPrice;
    if(type == "sztuka" || type == "czajnik"){
	    calculatedPrice = menuObject.prices.default;
    }
    else if(type == "gaiwan"){
	    calculatedPrice = menuObject.prices.gaiwan;
    }
    else if(type == "opakowanie"){
        calculatedPrice = menuObject.prices.package;
    }
    else if(type == "gram"){
        calculatedPrice = menuObject.prices.bulk;
    }
    return calculatedPrice * uiObject.quantity;
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The tea-shop server is on"); 
});
