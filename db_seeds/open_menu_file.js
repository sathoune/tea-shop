const fs = require("fs");

var result = [];

fs.readFile("db_seeds/menu_db.txt", 'utf8', (err, data) =>{
    if(err){
        console.log("something went wrong during reading file");
        console.log(err);
    } else {
        data = data.replace(/\t/g, ''); //remove tabs
        result = data.match(/[^\r\n]+/g);
    }
});

module.exports = result;