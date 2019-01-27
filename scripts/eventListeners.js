// $ is defined in scope of view
$(document).ready(function(){
    createListenersForInputs();
    createItem();
});


 
function calculatePrice(){
    $.ajax({
    	method: 'post',
    	url: '/data',
    	data: JSON.stringify({ name: $("#666 .name").val() }),
    	contentType: "application/json",
    	success: function(menuObject){
            if(Object.entries(menuObject).length){
                var type = $(".type").val()
                var quantity = $(".quantity").val()
    		    $(".registerCode").val(menuObject.registerCode);
                assignPrice(type, quantity, menuObject);
                
            } else {
    		    $("#registerCode").val("");
                $("#price").val("");
            }
        }
    });
}

function assignPrice(type, quantity, menuObject){
    var selector = ".price";
    if(type == "sztuka" || type == "czajnik"){
	    $(selector).val(menuObject.prices.default*quantity);
    }
    else if(type == "gaiwan"){
	    $(selector).val(menuObject.prices.gaiwan*quantity);
    }
    else if(type == "opakowanie"){
	    $(selector).val(menuObject.prices.package*quantity);
    }
    else if(type == "gram"){
	    $(selector).val(menuObject.prices.bulk*quantity);
    }
}

function createListenersForInputs(){
    $(".name").on("change", calculatePrice); 
    $(".type").on("change", calculatePrice);
    $(".quantity").on("change", calculatePrice);
    $(".quantity").on("change", calculatePrice);
    
}