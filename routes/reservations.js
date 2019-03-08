const   express     = require("express"),
        Reservation = require("../models/reservation"),
        router      = express.Router({ mergeParams: true });


router.post("/", (req, res) => {
        Reservation.find({}, (err, foundReservations) => {
                 if(err){ console.error("error founding orders" + err); }
                 else{ res.send(foundReservations); }
        });
});

router.post("/new", (req, res) => {
        const newReservation = {
                date: new Date(`${req.body.day}T${req.body.hour}:${req.body.minutes}:00`),
                name: req.body.name,
                table: req.body.table,
                people: req.body.people,
                waterPipe: req.body.waterPipe,
                hints: req.body.hints,
        };
        Reservation.create( newReservation, (err, createdReservation) => {
                if(err){ console.error("Not able to create reservation" + err); }
                else{ res.send(createdReservation); }
        });
});
module.exports = router;