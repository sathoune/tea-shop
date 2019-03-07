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
    var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    Localization.findOne({language: settings.language}, (err, foundLocalization) => {
        if(err){ console.error(err); }
        else{
            if(foundLocalization){ res.send(foundLocalization); }
            else { 
                let promiseToChangeLanguage = setLanguage("defaultLanguage");
                promiseToChangeLanguage.then( (resolve, reject) => {   
                    Localization.findOne({language: settings.language}, (err, foundLocalization) => {
                        if(err){ console.error("Error at db search at /language" + err); }
                        else { res.send(foundLocalization); }
                    });
                });
            }
        }
    });
});

router.post("/language/change", middleware.isLoggedIn, (req, res) => {
    Localization.findOne({language: req.body.language}, (err, foundLocalization) => {
        if(err){ console.error("language db err" + err); }
        else {
            if(foundLocalization){
                let promiseToChangeLanguage = setLanguage(req.body.language);
                promiseToChangeLanguage.then( (resolve, reject) => { res.send(resolve); });
            } else {
                let promiseToChangeLanguage = setLanguage("defaultLanguage");
                promiseToChangeLanguage.then( (resolve, reject) => { res.send(resolve);  });
            }
        }
    });
});

router.get("/:x", middleware.isLoggedIn, (req, res) => { res.redirect("/"); });

function setLanguage(language){
    let promise = new Promise( (resolve, reject) => {
        let settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
        settings.language = language;
        fs.writeFile("settings.json", JSON.stringify(settings), err => {
            if(err){ console.log(reject("error hile writing file")); }
            else { resolve("language changed"); }
        });
    });
    return promise;
}

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
