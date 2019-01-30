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
    createOrderBottomPanel(order_id);
    createOrderPanel(order_id);

    for(var i=0; i<itemsQuantity; i++){
        createItem(order_id);
    }
   
    
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
    var addItemButton = `<button onclick='createItem("${order_id}")'>Add brand new item</button>`;

    
    var TopPanelElements = [
        addItemButton,
        tableInput, 
        discountInput, 
        discountToGoCheckbox, 
        sendButton,
        ];
    $(topPanelDivSelector).append(TopPanelElements);
}

function createOrderLabels(order_id){
  
    var orderSelector = `#${order_id}.order`;
    var labelsDiv = `<div class="labels"></div>`;
    var labelsDivSelector = orderSelector + " .labels";
    $(orderSelector).append(labelsDiv);
    
    var labelCode = `<span>Code </span>`;
    var labelName = `<span>Name </span>`;
    var labelType = `<span>Type </span>`;
    var labelQuantity = `<span>Quantity </span>`;
    var labelPrice = `<span>Price </span>`;
    var labelHint = `<span>Hint </span>`;
    var labelDiscountedPrice = `<span>Discounted Price </span>`;
    
    var labels = [
        labelCode,
        labelName,
        labelType,
        labelQuantity,
        labelPrice,
        labelHint,
        labelDiscountedPrice,
        ];
    $(labelsDivSelector).append(labels);
    
}

function createOrderBottomPanel(order_id){
    var orderSelector = `#${order_id}.order`;
    var bottomPanelDiv = `<div style="order: 4;"class="bottom-panel"></div>`;
    var bottomPanelDivSelector = orderSelector + " .bottom-panel";
    $(orderSelector).append(bottomPanelDiv);
    
    var sumInput = "<label>sum</label><input type='number' value='0' class='sum' readonly>"
    var discountedSumInput = "<label>after discount</label><input type='number' value='0' class='discounted-sum' readonly>"
    
    var bottomPanelElements = [
        sumInput,
        discountedSumInput,
        ];
    
    $(bottomPanelDivSelector).append(bottomPanelElements);
}

function createOrderPanel(order_id){
    var orderPanelDiv = `<div class='item-container'></div>`
    var orderSelector = `#${order_id}.order`;
    $(orderSelector).append(orderPanelDiv);
    
    
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
        success: function(data){
            $(orderSelector +" .sum").val(data.sum); 
            $(orderSelector +" .discounted-sum").val(data.discountedSum); 
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
    	    $(orderSelector +" .sum").val(data.sum); 
            $(orderSelector +" .discounted-sum").val(data.discountedSum);   
        }
    });
}

function updateOrderTable(){
    
    var orderID = $(this).parent().parent()[0].id;
    var newTable = $(this).val();
    
    sendDataToUpdate('/order/edit-table', {_id: orderID, table: newTable}, callback);
    function callback(data){
        // TODO create movement of tables with flexbox and css
    }
}


function updateSumOfPrices(orderID){
    sendDataToUpdate('/order/edit-sum', { _id: orderID }, callback);
    function callback(data){
        $("#"+orderID+".order" + " .sum").val(data.sum); 
    }
}

function updateSumOfDiscountedPrices(orderID){
    
    sendDataToUpdate('/order/edit-discounted-sum', { _id: orderID}, callback);
    function callback(data){
        console.log(data);
        $("#"+orderID+".order" + " .discounted-sum").val(data.discountedSum); 

    }
}

function updateDiscount(){
    var orderID = $(this).parent().parent()[0].id;
    var newDiscount = $(this).val();
    
    sendDataToUpdate('/order/edit-discount', {_id: orderID, discount: newDiscount}, callback);
    function callback(data){
        $("#"+orderID+".order" + " .discounted-sum").val(data.discountedSum); 
        data.arrayOfPrices.forEach(function(item){
            $(`#${item.item_id}.item .discounted-price`).val(item.discountedPrice);
        })
   
    }
}