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
    createOrderLabels(order_id);
    for(var i=0; i<itemsQuantity; i++){
        createItem(order_id);
    }
    
}

function createOrderFrontPanel(order_id){
    var orderSelector = `#${order_id}.order`;
    
}

function createOrderLabels(order_id){
  
    var orderSelector = `#${order_id}.order`;
    var labelsDiv = `<div class="labels"></div>`;
    var labelsDivSelector = orderSelector + " .labels";
      console.log(labelsDiv);
    $(orderSelector).append(labelsDiv);
    var labels = `<span>Code </span><span>Name </span><span>Type </span><span>Quantity </span><span>Price </span>`
    $(labelsDivSelector).append(labels);
    
}
