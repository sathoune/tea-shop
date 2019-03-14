const   express     = require("express"),
        Reservation = require("../models/reservation"),
        router      = express.Router({ mergeParams: true });


router.post("/", (req, res) => {
        const now = new Date(req.body.today);
        var dateCriteria = {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1),
        };
        Reservation.find({date: dateCriteria}, (err, foundReservations) => {
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

router.post("/delete", (req, res) => {
        Reservation.findOneAndDelete(req.body, (err) => {
                if(err) { console.error('error removing reservation' + err); }
                else{ res.send('item deleted'); }
        });
});

router.post("/update", (req, res) => {
        const updatedReservation = {
                date: new Date(`${req.body.day}T${req.body.hour}:${req.body.minutes}:00`),
                name: req.body.name,
                table: req.body.table,
                people: req.body.people,
                waterPipe: req.body.waterPipe,
                hints: req.body.hints,
        };
        Reservation.findOneAndUpdate( {_id: req.body.id}, updatedReservation, (err, updatedReservation) => {
                if(err){ console.error("Not able to update reservation" + err); }
                else{ res.send('updated'); }
        });
});

router.post("/update/close", (req, res) => {
        Reservation.findOneAndUpdate( {_id: req.body._id}, {done: req.body.done}, (err, updatedReservation) => {
                if(err) { console.error('error closing reservation' + err); }
                else { res.send("reservation closed"); }
        });
});

router.post("/todo", (req, res) => {
        const now = new Date(req.body.day);
        var dateCriteria = {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1),
        };
        Reservation.find({date: dateCriteria, done: false}, (err, foundReservations) => {
                if(err){ 
                   console.log("err in reservations/todo route" + err); 
                   res.send("");
                }
                else { res.send(foundReservations); }
        });
});

module.exports = router;