
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
    (updatedOrder) => {$(`#${orderId}.order .sum`).val(Number(updatedOrder.sum).toFixed(2));});
}

function updateSumOfDiscountedPrices(orderId){
    sendRequest('/order/edit/discounted-sum', { _id: orderId }, 
    (updatedOrder) => {$(`#${orderId}.order .discounted-sum`).val(Number(updatedOrder.discountedSum).toFixed(2));});
}

function updateDiscount(){
    const orderId = $(this).parent().parent()[0].id;
    sendRequest('/order/edit/discount', {_id: orderId, discount: $(this).val()}, 
    (data) => {
        $(`#${orderId}.order  .discounted-sum`).val(Number(data.discountedSum).toFixed(2)); 
        data.orderedItems.forEach((item) => 
        { $(`#${item._id}.item .discounted-price`).val(Number(item.discountedPrice).toFixed(2)); });    
    });
}

function updateToGoDiscount(){
    const orderID = $(this).parent().parent().parent()[0].id;
    sendRequest('/order/edit/discount-togo', {_id: orderID, discountToGo: $(this).is(":checked")}, 
    (data) => {
        $(`#${orderID}.order .discounted-sum`).val(Number(data.discountedSum).toFixed(2)); 
        data.orderedItems.forEach((item) => 
        { $(`#${item._id}.item .discounted-price`).val(Number(item.discountedPrice).toFixed(2)); });
    });
}
