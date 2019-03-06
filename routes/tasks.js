const   express         = require("express"),
        Task           = require("../models/task"),
        router          = express.Router({ mergeParams: true });

router.post("/", (req, res) => {
    Task.find({day: req.body.day}, (err, foundTasks) => {
        if(err){ console.log(err); }
        else { res.send(foundTasks); }        
    });

});

router.post("/new", (req, res) => {
    Task.create(req.body, (err, createdTask) => {
       if(err){ console.log(err); }
       else{ res.send(createdTask); }
    });
});

router.post("/update", (req, res) => {
    Task.findOneAndUpdate({_id: req.body._id}, req.body, (err) => {
        if(err) { console.log(err); }
        else{ res.send('updated'); }
    });
});

router.post("/delete", (req, res) => {
    Task.findOneAndDelete({_id: req.body._id}, (err) => {
        if(err){console.log('Delete task error' + err); }
        else{res.send('task deleted');}
    });
});

module.exports = router;