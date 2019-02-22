const   express         = require("express"),
        Task           = require("../models/task"),
        router          = express.Router({ mergeParams: true });

router.post("/", (req, res) => {
    Task.find({}, (err, foundTasks) => {
        res.send(foundTasks);        
    })

});


module.exports = router;