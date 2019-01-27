
 
function sendUpdatedItem(){
    var itemID = $(this).parent()[0].id;
    console.log(itemID);
    var updatedItem = {
        id: itemID,
    
        name: $(`#${itemID} .name`).val(),
        quantity: $(`#${itemID} .quantity`).val(),
        type: $(`#${itemID} .type`).val(),
        price: $(`#${itemID} .price`).val(),
    
    };
   
    $.ajax({
    	method: 'post',
    	url: '/update-item',
    	data: JSON.stringify(updatedItem),
    	contentType: "application/json",
    	success: function(data){
            $(`#${itemID} .price`).val(data.price);
        }
    });
}


 