var express     = require("express"),
    app         = express();

var bodyParser = require("body-parser");

var passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");
    
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

app.use(flash());
app.use(require("express-session")({
    secret: "This is some secret password-storing",
    resave: false,
    saveUninitialized: false
}));

// passport config

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});



// routes
var indexRoutes         = require("./routes/index"),
    orderRoutes         = require("./routes/orders"),
    orderedItemRoutes   = require("./routes/orderedItems"),
    menuRoutes          = require("./routes/menu"),
    archiveRoutes       = require("./routes/archive");

app.use("/order",           orderRoutes);
app.use("/ordered-item",    orderedItemRoutes);
app.use("/menu",    menuRoutes);
app.use("/archive",    archiveRoutes);
app.use("/",                indexRoutes);


// menu seed
var seedMenu = require("./db_seeds/seedMenuItems");
//seedMenu();

// server start
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The tea-shop server is on"); 
});
