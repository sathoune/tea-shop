// Dynamically create order

function createOrder(){
    sendRequest('/order/new', {}, 
    (emptyOrder) => {createOrderDiv(emptyOrder._id);});

}

function createNavigation(){
    var topPanel = "<div id='top-panel'></div>";
    var createOrder = "<button id='create-order' style='height: 2em;' onclick='createOrder()'>Create A Brand New Tasty Order</button>";
    var orderDiv = "<div id='order-display'></div>";
    $('#record-view').append([topPanel, orderDiv]);
    $('#top-panel').append(createOrder);
}

function createOrderDiv(order_id, itemsQuantity=4){
    var div = `<div id=${order_id} class='order' style="display: flex; flex-direction: column;"></div>`;     
    
    $("#order-display").prepend(div);
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
    var discountInput = "<label class='discount-label'>Discount:</label><input type='number' class='discount' value='0' min='0' max='100'>%";
    var discountToGoCheckbox = "<label><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>na wagę</label>";
    var sendButton = `<button onclick='closeOrder("${order_id}")'>Send away</button>`;
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
    var deleteButton    = `<button class='delete-button' onclick='deleteOrder("${order_id}")'>Delete Order</button>`;  
    var sumInput = "<label class='sum-label'>sum</label><input type='number' value='0' class='sum' readonly>"
    var discountedSumInput = "<label class='discounted-sum-label'>after discount</label><input type='number' value='0' class='discounted-sum' readonly>"
    
    var bottomPanelElements = [
        deleteButton, 
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
 
 
 
 
// Editing scripts
 
 


function updateOrderTable(){
    
    var orderID = $(this).parent().parent()[0].id;
    var newTable = $(this).val();
    
    sendRequest('/order/edit-table', {_id: orderID, table: newTable}, callback);
    function callback(data){
        // TODO create movement of tables with flexbox and css
    }
}


function updateSumOfPrices(orderID){
    sendRequest('/order/edit-sum', { _id: orderID }, 
    (updatedOrder) => {$("#"+orderID+".order" + " .sum").val(updatedOrder.sum);});
}

function updateSumOfDiscountedPrices(orderID){
    
    sendRequest('/order/edit-discounted-sum', { _id: orderID }, 
    (updatedOrder) => {$("#"+orderID+".order" + " .discounted-sum").val(updatedOrder.discountedSum);});
}

function updateDiscount(){
    var orderID = $(this).parent().parent()[0].id;
    var newDiscount = $(this).val();
    
    sendRequest('/order/edit-discount', {_id: orderID, discount: newDiscount}, 
    (data) => {
        $("#"+orderID+".order" + " .discounted-sum").val(data.discountedSum); 
        data.arrayOfPrices.forEach((item) => 
        {
            $(`#${item.item_id}.item .discounted-price`).val(item.discountedPrice);
        });    
    });
    
}

function updateToGoDiscount(){
    var orderID = $(this).parent().parent().parent()[0].id;
    var discountToGo = $(this).is(":checked");

    sendRequest('/order/edit-discount-togo', {_id: orderID, discountToGo: discountToGo}, 
    (data) => {
        $("#"+orderID+".order" + " .discounted-sum").val(data.discountedSum); 
        data.arrayOfPrices.forEach(function(item){
            $(`#${item.item_id}.item .discounted-price`).val(item.discountedPrice);
        });
   
    });
}

function closeOrder(orderID){
    sendRequest('/order/close', {_id: orderID}, (data) => { $("#"+data+".order").remove();});
}

function findOpenOrders(){
    sendRequest('/order/old', {}, 
    (openOrders) => { openOrders.forEach(restoreOrder); });
}

function restoreOrder(orderData){
    var promise = new Promise((resolve, reject) => {
        restoreOrderDiv(orderData._id, orderData.orderedItems);  
        resolve();        
    });
    promise.then((resolve)=>{ updateOrderValues(orderData); });
}

function updateOrderValues(orderData){
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .discount`)      .val(orderData.discount);
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .sum`)           .val(orderData.sum);
    $(`#${orderData._id}.order .discounted-sum`).val(orderData.discountedSum);
    
}



function restoreOrderDiv(order_id, item_ids){
    var div = `<div id=${order_id} class='order' style="display: flex; flex-direction: column;"></div>`;     
    
    $("#order-display").append(div);
    createOrderTopPanel(order_id);
    createOrderLabels(order_id); 
    createOrderBottomPanel(order_id);
    createOrderPanel(order_id);
    item_ids.forEach((item_id) => { restoreItem(order_id, item_id); });
}

function deleteOrder(order_id){
    sendRequest('/order/delete', {_id: order_id}, (res) => {
       console.log(res); 
       $(`#${order_id}.order`).remove();
    });
}