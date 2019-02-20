function findOpenOrders(){
    sendRequest('/order/old', {}, (data) => { data.orders.forEach((order, i) =>{ restoreOrder(order, data.tableProperties[i]) }); });
}

function restoreOrder(orderData, tableParameters){
    const promise = new Promise((resolve, reject) => {
        restoreOrderDiv(orderData._id, orderData.items);  
        resolve();        
    });
    promise.then( (resolve) => { restoreOrderValues(orderData, tableParameters); });
}

function restoreOrderValues(orderData, tableParameters){
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .discount`)      .val(orderData.discount);
    $(`#${orderData._id}.order .table`)         .val(orderData.table);
    $(`#${orderData._id}.order .sum`)           .val(Number(orderData.sum).toFixed(2));
    $(`#${orderData._id}.order .discounted-sum`).val(Number(orderData.discountedSum).toFixed(2));
    $(`#${orderData._id}.order`).css('order', tableParameters.order);
    $(`#${orderData._id}.order .table`).css('background-color', tableParameters.color);
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
