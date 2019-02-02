// Dynamically create order

function createOrder(){
    sendRequest('/order/new', {}, 
    (emptyOrder) => {createOrderDiv(emptyOrder._id);});
}

function createNavigation(){
    const   topPanel = "<div id='top-panel'></div>",
            createOrder = "<button id='create-order' onclick='createOrder()'>Nowe zamówienie</button>",
            orderDiv = "<div id='order-display'></div>";
    $('#record-view').append([topPanel, orderDiv]);
    $('#top-panel').append(createOrder);
}

function createOrderDiv(orderId, itemsQuantity=4){
    const div = `<div id=${orderId} class='order'></div>`;     
    $("#order-display").prepend(div);
    createOrderTopPanel(orderId);
    createOrderLabels(orderId); 
    createOrderBottomPanel(orderId);
    createOrderItemPanel(orderId, itemsQuantity);
}

function createOrderTopPanel(orderId){
    const   topPanelDiv = `<div class="top-panel"></div>`;
    const   tableInput = "<input type='text' class='table' placeholder='stolik'>",
            discountInput = "<label class='discount-label'>Discount:</label><input type='number' class='discount' value='0' min='0' max='100'>%",
            discountToGoCheckbox = "<label><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>na wagę</label>",
            sendButton = `<button onclick='closeOrder("${orderId}")'>Send away</button>`,
            addItemButton = `<button onclick='createItem("${orderId}")'>Add brand new item</button>`;
    const TopPanelElements = [
            addItemButton,
            tableInput, 
            discountInput, 
            discountToGoCheckbox, 
            sendButton,
        ];
    $(`#${orderId}.order`).append(topPanelDiv);
    $(`#${orderId}.order .top-panel`).append(TopPanelElements);
}

function createOrderLabels(orderId){
    const labelsDiv = `<div class="labels"></div>`;
    const   labelCode = `<span>Code </span>`,
            labelName = `<span>Name </span>`,
            labelType = `<span>Type </span>`,
            labelQuantity = `<span>Quantity </span>`,
            labelPrice = `<span>Price </span>`,
            labelHint = `<span>Hint </span>`,
            labelDiscountedPrice = `<span>Discounted Price </span>`;
    const labels = [
            labelCode,
            labelName,
            labelType,
            labelQuantity,
            labelPrice,
            labelHint,
            labelDiscountedPrice,
        ];
    $(`#${orderId}.order`).append(labelsDiv);
    $(`#${orderId}.order .labels`).append(labels);
}

function createOrderBottomPanel(orderId){
    const   bottomPanelDiv = `<div class="bottom-panel"></div>`;
    const   deleteButton    = `<button class='delete-button' onclick='deleteOrder("${orderId}")'>Delete Order</button>`,  
            sumInput = "<label class='sum-label'>sum</label><input type='number' value='0' class='sum' readonly>",
            discountedSumInput = "<label class='discounted-sum-label'>after discount</label><input type='number' value='0' class='discounted-sum' readonly>"
    const bottomPanelElements = [
            deleteButton, 
            sumInput,
            discountedSumInput,
        ];
    $(`#${orderId}.order`).append(bottomPanelDiv);
    $(`#${orderId}.order .bottom-panel`).append(bottomPanelElements);
}

function createOrderItemPanel(orderId, itemsQuantity){
    const orderPanelDiv = `<div class='item-container'></div>`
    $(`#${orderId}.order`).append(orderPanelDiv);
    for(var i=0; i<itemsQuantity; i++){
        createItem(orderId);
    }
}
 
// Editing scripts
 
function updateOrderTable(){
    const orderId = $(this).parent().parent()[0].id;
    sendRequest('/order/edit-table', {_id: orderId, table: $(this).val()}, 
    (data) => {
       // TODO create movement of tables with flexbox and css
    });
}

function updateSumOfPrices(orderId){
    sendRequest('/order/edit-sum', { _id: orderId }, 
    (updatedOrder) => {$(`#${orderId}.order .sum`).val(updatedOrder.sum);});
}

function updateSumOfDiscountedPrices(orderId){
    sendRequest('/order/edit-discounted-sum', { _id: orderId }, 
    (updatedOrder) => {$(`#${orderId}.order .discounted-sum`).val(updatedOrder.discountedSum);});
}

function updateDiscount(){
    const orderId = $(this).parent().parent()[0].id;
    sendRequest('/order/edit-discount', {_id: orderId, discount: $(this).val()}, 
    (data) => {
        $(`#${orderId}.order  .discounted-sum`).val(data.discountedSum); 
        data.arrayOfPrices.forEach((item) => 
        { $(`#${item.item_id}.item .discounted-price`).val(item.discountedPrice); });    
    });
}

function updateToGoDiscount(){
    const orderID = $(this).parent().parent().parent()[0].id;
    sendRequest('/order/edit-discount-togo', {_id: orderID, discountToGo: $(this).is(":checked")}, 
    (data) => {
        $(`#${orderID}.order .discounted-sum`).val(data.discountedSum); 
        data.arrayOfPrices.forEach((item) => { $(`#${item.item_id}.item .discounted-price`).val(item.discountedPrice); });
    });
}

function closeOrder(orderID){
    sendRequest('/order/close', {_id: orderID}, (data) => { $(`#${data}.order`).remove();});
}

function findOpenOrders(){
    sendRequest('/order/old', {}, (openOrders) => { openOrders.forEach(restoreOrder); });
}

function restoreOrder(orderData){
    const promise = new Promise((resolve, reject) => {
        restoreOrderDiv(orderData._id, orderData.orderedItems);  
        resolve();        
    });
    promise.then( (resolve) => { restoreOrderValues(orderData); });
}

function restoreOrderValues(orderData){
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .discount`)      .val(orderData.discount);
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .sum`)           .val(orderData.sum);
    $(`#${orderData._id}.order .discounted-sum`).val(orderData.discountedSum);
    
}



function restoreOrderDiv(orderId, itemIds){
    const div = `<div id=${orderId} class='order' style="display: flex; flex-direction: column;"></div>`;     
    
    $("#order-display").append(div);
    createOrderTopPanel(orderId);
    createOrderLabels(orderId); 
    createOrderBottomPanel(orderId);
    createOrderItemPanel(orderId);
    itemIds.forEach( (itemId) => { restoreItem(orderId, itemId); });
}

function deleteOrder(orderId){
    sendRequest('/order/delete', {_id: orderId}, (res) => { $(`#${orderId}.order`).remove(); });
}