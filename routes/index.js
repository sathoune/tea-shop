const   express     = require("express"),
        MenuItem    = require("../models/menu"),
        middleware  = require("../middleware"),
        passport    = require("passport"),
        User        = require("../models/user"),
        Localization= require("../models/localization"),
        router      = express.Router({ mergeParams: true });
        
const fs = require('fs');

router.get("/login", (req, res) => { res.render("login"); });

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), (req, res) => {
});

router.get("/", middleware.isLoggedIn, (req, res) => {
    MenuItem.find({}, (err, results) => {
        if(err){ console.log(err); }  
        else { 
            res.render("index", {foundItems: results}); }
    });
});

router.post("/language", middleware.isLoggedIn, (req, res) => {
    var obj = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    Localization.findOne({language: obj.language}, (err, foundLocalization) => {
        if(err){ console.error(err); }
        else{ res.send(foundLocalization.data); }
    });
});

router.post("/language/change", middleware.isLoggedIn, (req, res) => {
    var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    settings.language = req.body.language;
    fs.writeFile("settings.json", JSON.stringify(settings), err => {
        if(err){
            console.log(err);
            return;
        }
        res.send("language changed");
    });
    

});


router.get("/:x", middleware.isLoggedIn, (req, res) => { res.redirect("/"); });

module.exports = router;


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
