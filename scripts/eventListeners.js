// $ is defined in scope of view
$(document).ready(function(){
    createItem();
    createListenersForInputs();
    
    });


 
function calculatePrice(){
    
    var itemID =  $(this).parent()[0].id;
    
    $.ajax({
    	method: 'post',
    	url: '/data',
    	data: JSON.stringify({ name: $(`#${itemID} .name`).val() }),
    	contentType: "application/json",
    	success: function(menuObject){
            if(Object.entries(menuObject).length){
                var type = $(`#${itemID} .type`).val()
                var quantity = $(`#${itemID} .quantity`).val()
    		    $(`#${itemID} .registerCode`).val(menuObject.registerCode);
                assignPrice(itemID, type, quantity, menuObject);
                
            } else {
    		    $("#registerCode").val("");
                $("#price").val("");
            }
        }
    });
}

function assignPrice(itemID, type, quantity, menuObject){
    var selector = `#${itemID} .price`;
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
    $('#master').on('change', 'div .name', calculatePrice);
    $('#master').on('change', 'div .type', calculatePrice);
    $('#master').on('change', 'div .quantity', calculatePrice);
    $('#master').on('keydown', 'div .quantity', calculatePrice);
}
