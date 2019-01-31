function openArchive(){
    sendDataToUpdate("/archive/", {}, callback);
    function callback(data){
        console.log(data);
    }
}

function closeArchive(){
    console.log("ldsa");
}