var express = require("express");
var router = express.Router({ mergeParams: true });
var MenuItem = require("../models/menu");
var middleware = require("../middleware");
var passport = require("passport");
var User = require("../models/user");


router.get("/login", (req, res) => { res.render("login"); });

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), (req, res) => {
    res.flash("success", "Pij dobro herbatku");
});

//No more users
router.get("/register", (req, res) => { res.render("register"); });

router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if(err){ return res.render("register", { "error": err.message }); }
        passport.authenticate("local")(req, res, () => {
            //req.flash("success", "Welcome to YelpCamp," + user.username + "!");
            res.redirect("/");
        });
    });
});

router.get("/", middleware.isLoggedIn, (req, res) => {
    MenuItem.find({}, (err, results) => {
        if(err){ console.log(err); }  
        else { 
            req.flash('success', 'This is a test notification.');
            res.render("index", {foundItems: results}); }
    });
});

router.get("/:x", middleware.isLoggedIn, (req, res) => { res.redirect("/"); });

module.exports = router;