var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

obj = JSON.stringify(obj);

fs.writeFile("settings.json", obj, err => {
    if(err){
        console.log(err);
        return;
    }
    console.log('file was saved');
});