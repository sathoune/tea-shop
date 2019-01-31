function openMenu(){
    console.log("opening menu...");
    $("#master").hide();
    sendDataToUpdate("/menu", {}, callback);
    function callback(data){
        console.log(data);
    }
}