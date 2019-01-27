// $ is defined in scope of view
$(document).ready(function(){
    $("#name").change(calculatePrice); 
    $("#type").change(calculatePrice);
    $("#quantity").change(calculatePrice);
    
});
 
function calculatePrice(){
    $.ajax({
    	method: 'post',
    	url: '/data',
    	data: JSON.stringify({ name: $("#name").val() }),
    	contentType: "application/json",
    	success: function(data){
            console.log(data);
            if(Object.entries(data).length){
                var type = $("#type").val()
                var quantity = $("#quantity").val()
    		    $("#registerCode").val(data.registerCode);

                if(type == "sztuka" || type == "czajnik"){
        		    $("#price").val(data.prices.default*quantity);
                }
                else if(type == "gaiwan"){
        		    $("#price").val(data.prices.gaiwan*quantity);
                }
                else if(type == "opakowanie"){
        		    $("#price").val(data.prices.package*quantity);
                }
                else if(type == "gram"){
        		    $("#price").val(data.prices.bulk*quantity);
                }
            } else {
    		    $("#registerCode").val("");
                $("#price").val("");
            }
        }
    });
}