const   express     = require("express"),
        Reservation = require("../models/reservation"),
        router      = express.Router({ mergeParams: true });


router.post("/", (req, res) => {
        console.log('hi');
        res.send('hi');
});


module.exports = router;