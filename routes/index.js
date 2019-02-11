var express = require("express");
var router = express.Router({ mergeParams: true });
var MenuItem = require("../models/menu");
var middleware = require("../middleware");


router.get("/login", (req, res) => {
   res.send("login pls"); 
});

router.get("/register", (req, res) => {
   res.send("register here"); 
});

router.get("/", middleware.isLoggedIn, (req, res) => {
    
    MenuItem.find({}, (err, results) => {
        if(err){ console.log(err); }  
        else { res.render("index", {foundItems: results}); }
    });
});

router.get("/:x", middleware.isLoggedIn, (req, res) => {
    res.redirect("/");
});

module.exports = router;