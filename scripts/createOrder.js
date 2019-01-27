function createOrder(){
    $.ajax({
        	method: 'post',
        	url: '/create-order',
        	contentType: "application/json",
        	success: function(data){
        	    console.log(data);
        	    createOrderDiv(data._id);
            }
                
    });
    
    
}

function createOrderDiv(order_id, itemsQuantity=4){
    var div = `<div id=${order_id} class='order'></div>`;     
    
    $("#master").append(div);
    for(var i=0; i<itemsQuantity; i++){
        createItem(`#${order_id}.order`);
    }
    
}
