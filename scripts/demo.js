// $ is defined in scope of view
$(document).ready(function(){
    $("#name").change(function(){
       magicTrick(); 
    });
});

function magicTrick(){
    $.ajax({
    	method: 'post',
    	url: '/data',
    	data: JSON.stringify({ name: $("#name").val() }),
    	contentType: "application/json",
    	success: function(data){
            console.log(data);
            if(Object.entries(data).length){
                var type = $("#type").val()
    		    $("#registerCode").val(data.registerCode);

                if(type == "sztuka" || type == "czajnik"){
        		    $("#price").val(data.prices.default);
                }
                else if(type == "gaiwan"){
        		    $("#price").val(data.prices.gaiwan);
                }
                else if(type == "opakowanie"){
        		    $("#price").val(data.prices.package);
                }
                else if(type == "gram"){
        		    $("#price").val(data.prices.bulk);
                }
            } else {
    		    $("#registerCode").val("");
                $("#price").val("");
            }
        }
    });
}