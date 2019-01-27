
 
function sendUpdatedItem(){
    var itemID = $(this).parent()[0].id;
    var updatedItem = {
        id: itemID,
    
        name: $(`#${itemID}.item .name`).val(),
        quantity: $(`#${itemID}.item .quantity`).val(),
        type: $(`#${itemID}.item .type`).val(),
        price: $(`#${itemID}.item .price`).val(),
    
    };
   
    $.ajax({
    	method: 'post',
    	url: '/update-item',
    	data: JSON.stringify(updatedItem),
    	contentType: "application/json",
    	success: function(data){
    	   
            $(`#${itemID}.item .price`).val(data.price);
            $(`#${itemID}.item .registercode`).val(data.registerCode);
        }
    });
}


 