// $ is defined in scope of view
$(document).ready(function(){
    $("#name").change(calculatePrice); 
    $("#type").change(calculatePrice);
    $("#quantity").change(calculatePrice);
    $("#quantity").keydown(calculatePrice);
});
 
function calculatePrice(){
    $.ajax({
    	method: 'post',
    	url: '/data',
    	data: JSON.stringify({ name: $("#name").val() }),
    	contentType: "application/json",
    	success: function(menuObject){
            if(Object.entries(menuObject).length){
                var type = $("#type").val()
                var quantity = $("#quantity").val()
    		    $("#registerCode").val(menuObject.registerCode);
                assignPrice(type, quantity, menuObject);
                
            } else {
    		    $("#registerCode").val("");
                $("#price").val("");
            }
        }
    });
}

function assignPrice(type, quantity, menuObject){
    if(type == "sztuka" || type == "czajnik"){
	    $("#price").val(menuObject.prices.default*quantity);
    }
    else if(type == "gaiwan"){
	    $("#price").val(menuObject.prices.gaiwan*quantity);
    }
    else if(type == "opakowanie"){
	    $("#price").val(menuObject.prices.package*quantity);
    }
    else if(type == "gram"){
	    $("#price").val(menuObject.prices.bulk*quantity);
    }
}