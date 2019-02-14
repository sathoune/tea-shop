const   express     = require("express"),
        MenuItem    = require("../models/menu"),
        router      = express.Router({ mergeParams: true });

router.post("/show/all", (req, res) => {
    MenuItem.find({}, (err, menu) => {
        if(err) { console.log(err);} 
        else { res.send(menu); }
    });
});

router.post("/edit", (req, res) => {
    MenuItem.findOneAndUpdate({_id: req.body._id}, req.body.newData, (err) => {
       if(err) { console.log(err);} 
       else { res.send("well played"); }
    });
});

router.post("/new", (req, res) => {
   MenuItem.create({}, (err, newItem) => {
       if(err) { console.log(err);} 
       else { res.send(newItem); }
   });
});

router.post("/delete", (req, res) => {
    MenuItem.findOneAndDelete({_id: req.body._id}, (err) => {
        if(err) { console.log(err);} 
        else { res.send("item deleted"); }
    });
});

module.exports = router;