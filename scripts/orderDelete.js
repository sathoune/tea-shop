function deleteOrder(orderId){
    sendRequest('/order/delete', {_id: orderId}, (res) => { $(`#${orderId}.order`).remove(); });
}


function closeOrder(orderID){
    sendRequest('/order/close', {_id: orderID}, (data) => { $(`#${data}.order`).remove();});
}
