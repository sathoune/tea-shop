const   localizationData = require("../db_seeds/localization.js"),
        mongoose = require("mongoose"),
        Localization = require("../models/localization.js");

const dbURL = process.env.DATABASEURL || "mongodb://localhost:27017/tea-shop";
mongoose.connect(dbURL, {useNewUrlParser: true}, (err) => {
    if(err){
        console.log("Something went wrong");
        console.log(err);
    } else {
        console.log("connected to mongo");
    }
});
Localization.deleteMany({}, (err) => {if(err){console.log(err);}});

const supportedLanguages = {
    defaultLanguage: "english",
    english: "english",
    polish: "polish",
    czech: "czech",
};

const formattedData = formatData(localizationData, supportedLanguages);


for(let language in formattedData){
    let dbObject = {language: language, data:formattedData[language]};
    Localization.create(dbObject, (err, createdLocalization) =>
    { 
        if(err){ console.log("Failed to add new language" + err); } 
        else{
            createdLocalization.save(); } 
    });
}

function formatData(unformattedData, languageObject){
    const result = createFormattedObject(languageObject);
    result['defaultLanguage'] = result['english'];
    for(let phrase in unformattedData){
        for(let language in result){
            let phraseInLanguage = unformattedData[phrase][language];
            if(phraseInLanguage){ result[language][phrase] = phraseInLanguage; }
            else{
                result[language][phrase] = unformattedData[phrase]["defaultLanguage"];
            }
        }
    }
    return result;
}

function createFormattedObject(languageObject){
    const formattedObject = {};
    for(let language in languageObject){
        formattedObject[language] = {};
    }
    return formattedObject; 
}
