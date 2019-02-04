// Dynamically create order

function createOrder(){
    sendRequest('/order/new', {}, 
    (emptyOrder) => {createOrderDiv(emptyOrder._id);});
}

function createNavigation(){
    const   topPanel = "<div id='top-panel'></div>",
            createOrder = `<button id='create-order' onclick='createOrder()'><i class="fas fa-folder-plus"></i> Nowe zamówienie <i class="fas fa-folder-plus"></i></button>`,
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
    $(`#${orderId}.order`).css("order", 0);
}

function createOrderTopPanel(orderId){
    const   topPanelDiv = `<div class="top-panel"></div>`;
    const   tableInput = "<input type='text' class='table' placeholder='stolik'>",
            discountInput = "<label class='discount-label'>Discount:</label><input type='number' class='discount' value='0' min='0' max='100'>%",
            discountToGoCheckbox = "<label><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>na wagę</label>",
            sendButton = `<button class='send-button' onclick='closeOrder("${orderId}")'>Zamknij zamówienie <i class="fas fa-pencil-alt"></i>

</button>`,
            addItemButton = `<button class='add-item-button' onclick='createItem("${orderId}")'><i class="fas fa-plus"></i> Dodaj rząd</button>`,
            collapseButton = `<button class='collapse-order' onclick='collapseItems("${orderId}")'>
            <i class="fas fa-angle-up"></i> Zwiń zamówienie <i class="fas fa-angle-up"></i></button>`
    const TopPanelElements = [
            addItemButton,
            tableInput,
            collapseButton,
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
    const   deleteButton    = `<button class='delete-button' onclick='deleteOrder("${orderId}")'>
    <i class="fas fa-dumpster"></i> Usuń zamówienie <i class="fas fa-dumpster"></i></button>`,  
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
    const tableValue = $(this).val();
    sendRequest('/order/edit/table', {_id: orderId, table: tableValue}, 
    (data) => {
        orderTable(tableValue, orderId);
    });
}

function updateSumOfPrices(orderId){
    sendRequest('/order/edit/sum', { _id: orderId }, 
    (updatedOrder) => {$(`#${orderId}.order .sum`).val(updatedOrder.sum);});
}

function updateSumOfDiscountedPrices(orderId){
    sendRequest('/order/edit/discounted-sum', { _id: orderId }, 
    (updatedOrder) => {$(`#${orderId}.order .discounted-sum`).val(updatedOrder.discountedSum);});
}

function updateDiscount(){
    const orderId = $(this).parent().parent()[0].id;
    sendRequest('/order/edit/discount', {_id: orderId, discount: $(this).val()}, 
    (data) => {
        $(`#${orderId}.order  .discounted-sum`).val(data.discountedSum); 
        data.orderedItems.forEach((item) => 
        { $(`#${item._id}.item .discounted-price`).val(item.discountedPrice); });    
    });
}

function updateToGoDiscount(){
    const orderID = $(this).parent().parent().parent()[0].id;
    sendRequest('/order/edit/discount-togo', {_id: orderID, discountToGo: $(this).is(":checked")}, 
    (data) => {
        $(`#${orderID}.order .discounted-sum`).val(data.discountedSum); 
        data.orderedItems.forEach((item) => 
        { $(`#${item._id}.item .discounted-price`).val(item.discountedPrice); });
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
    orderTable(orderData.table, orderData._id);
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

function orderTable(tableValue, orderId){
    if(tableValue==''){
        $(`#${orderId}.order`).css('order', 0);
    }
    else if('m1' == tableValue){
        $(`#${orderId}.order`).css('order', 10);
    }
    else if('m2' == tableValue){
        $(`#${orderId}.order`).css('order', 12);
    }
    else if('m3' ==tableValue){
        $(`#${orderId}.order`).css('order', 14);
    }
    else if('m4' == tableValue){
        $(`#${orderId}.order`).css('order', 16);
    }
    
    else if('k1' == tableValue){
        $(`#${orderId}.order`).css('order', 20);
    }
    else if('k2' == tableValue){
        $(`#${orderId}.order`).css('order', 22);
    }
    else if('k3' == tableValue){
        $(`#${orderId}.order`).css('order', 24);
    }
    else if('t' == tableValue){
        $(`#${orderId}.order`).css('order', 26);
    }
    else if('k4' == tableValue){
        $(`#${orderId}.order`).css('order', 28);
    }
    else if('k5' == tableValue){
        $(`#${orderId}.order`).css('order', 30);
    }
    else if('k6' == tableValue){
        $(`#${orderId}.order`).css('order', 32);
    }
    
    else if('o1' == tableValue){
        $(`#${orderId}.order`).css('order', 40);
    }
    else if('o2' == tableValue){
        $(`#${orderId}.order`).css('order', 42);
    }
    else if('o3' == tableValue){
        $(`#${orderId}.order`).css('order', 44);
    }
    else if(/out./.test(tableValue)){
        $(`#${orderId}.order`).css('order', 8);
    }
    
    else{
        $(`#${orderId}.order`).css('order', 5);
    }
}


function collapseItems(orderId){
    
    
    $(`#${orderId}.order .item-container`).toggleClass('hidden');
    $(`#${orderId}.order .labels`).toggleClass('hidden');

    if($(`#${orderId}.order .item-container`).hasClass('hidden')){
        $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-down"></i> Pokaż zamówienie <i class="fas fa-angle-down"></i>');
    } else {
        $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-up"></i> Zwiń zamówienie <i class="fas fa-angle-up"></i>');
    }
}