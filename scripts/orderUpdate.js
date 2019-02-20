
function updateOrderTable(){
    const orderId = $(this).parent().parent()[0].id;
    const tableValue = $(this).val();
    sendRequest('/order/edit/table', {_id: orderId, table: tableValue}, 
    (tableParameters) => {
        $(`#${orderId}.order`).css('order', tableParameters.order);
        $(`#${orderId}.order .table`).css('background-color', tableParameters.color);
        window.location.href = `#${orderId}`;
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
        data.items.forEach((item) => 
        { $(`#${item._id}.item .discounted-price`).val(Number(item.discountedPrice).toFixed(2)); });    
    });
}

function updateToGoDiscount(){
    const orderID = $(this).parent().parent().parent()[0].id;
    sendRequest('/order/edit/discount-togo', {_id: orderID, discountToGo: $(this).is(":checked")}, 
    (data) => {
        $(`#${orderID}.order .discounted-sum`).val(Number(data.discountedSum).toFixed(2)); 
        data.items.forEach((item) => 
        { $(`#${item._id}.item .discounted-price`).val(Number(item.discountedPrice).toFixed(2)); });
    });
}

function checkIfAllNameInputsAreUsed(orderId){
    var items = $(`#${orderId}.order .item .name`);
    for(var i=0; i< items.length; i++){
        if($(items[i]).val() == ""){ return false; }
    }
    return true;
}

