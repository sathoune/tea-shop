const   express     = require("express"),
        MenuItem    = require("../models/menu"),
        middleware  = require("../middleware"),
        passport    = require("passport"),
        User        = require("../models/user"),
        router      = express.Router({ mergeParams: true });
        
router.get("/login", (req, res) => { res.render("login"); });

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), (req, res) => {
});

//No more users
// router.get("/register", (req, res) => { res.render("register"); });

// router.post("/register", (req, res) => {
//     var newUser = new User({ username: req.body.username });
//     User.register(newUser, req.body.password, (err, user) => {
//         if(err){ return res.render("register", { "error": err.message }); }
//         passport.authenticate("local")(req, res, () => {
//             res.redirect("/");
//         });
//     });
//});

router.get("/", middleware.isLoggedIn, (req, res) => {
    MenuItem.find({}, (err, results) => {
        if(err){ console.log(err); }  
        else { 
            res.render("index", {foundItems: results}); }
    });
});

router.get("/:x", middleware.isLoggedIn, (req, res) => { res.redirect("/"); });

module.exports = router;