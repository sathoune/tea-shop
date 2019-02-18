function findOpenOrders(){
    sendRequest('/order/old', {}, (openOrders) => { openOrders.forEach(restoreOrder); });
}

function restoreOrder(orderData){
    const promise = new Promise((resolve, reject) => {
        restoreOrderDiv(orderData._id, orderData.items);  
        resolve();        
    });
    promise.then( (resolve) => { restoreOrderValues(orderData); });
}

function restoreOrderValues(orderData){
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .discount`)      .val(orderData.discount);
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .sum`)           .val(Number(orderData.sum).toFixed(2));
    $(`#${orderData._id}.order .discounted-sum`).val(Number(orderData.discountedSum).toFixed(2));
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
