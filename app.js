var express     = require("express"),
    app         = express();

var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + "/public"));


// connect to db
var mongoose    = require("mongoose"),
    dbURL       = "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, function(err){
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});

// routes
var indexRoutes         = require("./routes/index"),
    orderRoutes         = require("./routes/orders"),
    orderedItemRoutes   = require("./routes/orderedItems");
    menuRoutes          = require("./routes/menu");

app.use("/order",           orderRoutes);
app.use("/ordered-item",    orderedItemRoutes);
app.use("/menu",    menuRoutes);
app.use("/",                indexRoutes);


// menu seed
var seedMenu = require("./db_seeds/seedMenuItems");
// seedMenu();

// server start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The tea-shop server is on"); 
});
