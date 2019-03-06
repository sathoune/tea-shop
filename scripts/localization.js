/* global $ */

var strings = {};

var promiseLanguage = new Promise(resolve => {
    sendRequest("/language", {}, data => {
        strings = data;
       resolve(); 
    });
});


function changeLanguage(event){
    const newLanguage = (this.value);
    sendRequest("/language/change", {language: newLanguage}, data => {
        window.location.reload();
    });
}

function sendRequest(url, newData, callback){
    $.ajax(
    {
    	method: 'post',
    	url: url,
    	data: JSON.stringify(newData),
    	contentType: "application/json",
    	success: (data) => { callback(data); },
    });
}