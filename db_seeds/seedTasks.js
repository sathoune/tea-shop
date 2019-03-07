var mongoose = require("mongoose");
var Task = require("../models/task.js");

const tasks = {
    Monday : [
        "parapety z pajęczyn",
        "laptop i okolice - kurz",
        "dołoż pu-erhy i japonki na półkę sprzedażową",
        "dołoż torebki papierowe i do pakowania herby",
        "sprawdź ilość filtrów - wiadomość do B.",
        "sprawdź ilość dań indyjskich i pit - wiadomość do B.",
    ],
    Tuesday: [
        'dołóż marlenkę',
        'dołóż drobne',
        'sprawdź ilość węgielków i ustników - wiadomość do B.',
        'sprawdź czy nie brakuje yerba mate i akcesoriów - w do B.',
    ],
    Wednesday: [
        'dołóż drobne',
        'dorób mieszanki herbaciane',
        'popraw ulotki',
    ],
    Thursday: [
        'dosyp mieszanki orzechowe',
        'dosyp yerba mate i miętę do puchy', 
        'dosyp przyprawy',
        'dorób matcha kulki',
    ],
    Friday: [
        'dołóż drobne',
        'dołóż marlenkę',
        'dosyp herbat',
        'dołóż herbaty na półki sprzedażowe',
        'dorób syrop cukrowy',
    ],
    Saturday: [
        'baw się dobrze ;)',
        'pamiętaj o rezerwacjach',
    ],
    Sunday: [
        'umyj węże na koniec zmiany',
        'sprawdź czy jest mydło u klientów',
        'pamiętaj o rezerwacjach',
    ],
};


const dbURL = process.env.DATABASEURL || "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, (err) => {
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});
Task.deleteMany({}, (err) => {if(err){console.log(err);}});

for(var key in tasks){
    tasks[key].forEach(task => {
        const newTask = {
            day: key,
            task: task,
            done: false,
        };
        Task.create(newTask, (err, newTask) => { 
            if(err){ console.log(err); } 
            else{
                console.log('task created');
                newTask.save();
            }
        });
    });
}