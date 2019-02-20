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
