function openMenuFileAndSplitIntoLines(){
    var result = [];
    const fs = require("fs");
    result = fs.readFileSync("./db_seeds/menu_db.txt", 'utf8', (err, data) =>{
        if(err){
            console.log("something went wrong during reading file");
            console.log(err);
        }
    });
    result = result.replace(/\t/g, ''); //remove tabs
    result = result.match(/[^\r\n]+/g); //split by endline
    return result;
}

function splitIntoObjects(arrayOfLines){
    var beautifulArrayOfObjects = [];
    arrayOfLines.forEach(function(line){
        var splittedLine = line.split(";");
        for(var i=0; i<splittedLine.length; i++){
            splittedLine[i] = splittedLine[i].trim();
        }
        beautifulArrayOfObjects.push(makeMenuObject(splittedLine));
    });
    return beautifulArrayOfObjects;
}

function makeMenuObject(arrayOfMenuStrings){
    return {
           name: arrayOfMenuStrings[0],
           registerCode: arrayOfMenuStrings[1],
           prices: {
               default: arrayOfMenuStrings[2],
               gaiwan: arrayOfMenuStrings[3],
               package: arrayOfMenuStrings[4],
               bulk: arrayOfMenuStrings[5],
            }
        }
}

module.exports = splitIntoObjects(openMenuFileAndSplitIntoLines());