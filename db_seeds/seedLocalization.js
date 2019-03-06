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

Localization.deleteMany({});

const supportedLanguages = {
    defaultLanguage: "english",
    english: "english",
    polish: "polish",
    czech: "czech",
};

const formattedData = formatData(localizationData, supportedLanguages);

for(let language in formattedData){
    let dbObject = {language: language, data:formattedData[language]};
    Localization.create({dbObject}, (err, createdLocalization) =>
    { 
        if(err){ console.log("Failed to add new language" + err); } 
        else{ createdLocalization.save(); } 
    });
}

function createFormattedObject(languageObject){
    const formattedObject = {};
    for(let language in languageObject){
        formattedObject[language] = {};
    }
    return formattedObject; 
}

function formatData(unformattedData, languageObject){
    const result = createFormattedObject(languageObject);
    for(let phrase in localizationData){
        for(let language in result){
            let phraseInLanguage = localizationData[phrase][language];
            if(phraseInLanguage){ result[language][phrase] = phraseInLanguage; }
            else{
                result[language][phrase] = localizationData[phrase]["defaultLanguage"];
            }
        }
    }
    return result;
}