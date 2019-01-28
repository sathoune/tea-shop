function createOrder(){
    $.ajax({
        	method: 'post',
        	url: '/order/new',
        	contentType: "application/json",
        	success: function(data){
        	    createOrderDiv(data._id);
            }
                
    });
    
    
}

function createOrderDiv(order_id, itemsQuantity=4){
    var div = `<div id=${order_id} class='order' style="display: flex; flex-direction: column;"></div>`;     
    
    $("#master").append(div);
    createOrderTopPanel(order_id);
    createOrderLabels(order_id);
    for(var i=0; i<itemsQuantity; i++){
        createItem(order_id);
    }
    createOrderBottomPanel(order_id);

    
}

function createOrderTopPanel(order_id){
    var orderSelector = `#${order_id}.order`;
    var topPanelDiv = `<div class="top-panel"></div>`;
    var topPanelDivSelector = orderSelector + " .top-panel";
    $(orderSelector).append(topPanelDiv);
    
    var tableInput = "<input type='text' class='table' placeholder='stolik'>";
    var discountInput = "<label>Discount:</label><input type='number' class='discount' value='0' min='0' max='100'>%";
    var discountToGoCheckbox = "<label><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>na wagę</label>";
    var sendButton = "<input type='button' value='Send Away'>";
    $(topPanelDivSelector).append(tableInput, discountInput, discountToGoCheckbox, sendButton);
}

function createOrderLabels(order_id){
  
    var orderSelector = `#${order_id}.order`;
    var labelsDiv = `<div class="labels"></div>`;
    var labelsDivSelector = orderSelector + " .labels";
    $(orderSelector).append(labelsDiv);
    
    var labels = `<span>Code </span><span>Name </span><span>Type </span><span>Quantity </span><span>Price </span>`
    $(labelsDivSelector).append(labels);
    
}

function createOrderBottomPanel(order_id){
    var orderSelector = `#${order_id}.order`;
    var bottomPanelDiv = `<div style="order: 4;"class="bottom-panel"></div>`;
    var bottomPanelDivSelector = orderSelector + " .bottom-panel";
    $(orderSelector).append(bottomPanelDiv);
    
    var sumInput = "<label>sum</label><input type='number' value='0' class='sum'>"
    var discountedSumInput = "<label>after discount</label><input type='number' value='0' class='discounted-sum'>"
    var addItemButton = `<button onclick='createItem("${order_id}")'>Add brand new item</button>`;
    $(bottomPanelDivSelector).append(addItemButton, sumInput, discountedSumInput);
}


 
function sendUpdatedOrder(){
   
    var orderID = $(this).parent().parent()[0].id;
   
    var orderSelector = `#${orderID}.order`;
    var updatedOrder = {
        orderID: orderID,
        values: {
            discount: $(orderSelector + " .discount").val(),
            discountToGo: $(orderSelector + " .discount-to-go").is(":checked"),
            table: $(orderSelector + " .table").val(),
        }
    }
    $.ajax({
        method: 'post',
        url: '/order/edit',
        data: JSON.stringify(updatedOrder),
        contentType: "application/json",
        success: function(sum){
            $(orderSelector +" .sum").val(sum); 
        }
    });
    
}


function sendUpdatedOrderForCheckbox(){
   
    var orderID = $(this).parent().parent().parent()[0].id;
   
    var orderSelector = `#${orderID}.order`;
    var updatedOrder = {
        orderID: orderID,
        values: {
            discount: $(orderSelector + " .discount").val(),
            discountToGo: $(orderSelector + " .discount-to-go").is(":checked"),
            table: $(orderSelector + " .table").val(),
        }
    }
     $.ajax({
    	method: 'post',
    	url: '/order/edit',
    	data: JSON.stringify(updatedOrder),
    	contentType: "application/json",
    	success: function(data){
    	    console.log(data);   
        }
    });
}
