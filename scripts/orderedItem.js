// create item

function createItem(orderId){
    const parentSelector = "#"+orderId+".order .item-container";
    sendRequest('/ordered-item/new', {orderID: orderId}, 
    (emptyItem) => { createItemDiv(emptyItem._id, parentSelector);});
}

function createItemDiv(item_id, parentSelector){
    const div = `<div id=${item_id} class='item'></div>`;     
    $(parentSelector).append(div);  
    insertInputsInto($(`#${item_id}`));
}

function insertInputsInto(div){
    const   itemID = div[0].id;
    const   deleteButton          = `<button class='delete-button' onclick='removeItemFromDisplay("${itemID}")'>
    <i class="fas fa-trash-alt"></i></button>`, 
            nameInput             = '<input type="text" class="name" list="tees">',
            codeInput             = '<input type="text" class="registerCode" readonly>',
            priceInput            = '<input type="number" class="price">',
            quantityInput         = '<input type="number" class="quantity" name="quantity" min="0" value="1">',
            hintInput             = '<input type="text" class="hint">',
            discountedPriceInput  = '<input type="number" class="discounted-price" readonly>',
            typeInput             = `<select class="type">
                                        <option value="sztuka">sztuka</option>
                                        <option value="czajnik">czajnik</option>
                                        <option value="gaiwan">gaiwan</option>
                                        <option value="opakowanie">opakowanie</option>
                                        <option value="gram">gram</option>
                                    </select>`;
  const inputElements = [
        deleteButton,
        codeInput,
        nameInput,
        typeInput,
        quantityInput,
        priceInput,
        hintInput,
        discountedPriceInput,
    ];
    div.append(inputElements);
}

// editing scripts

function updateItemName(){
    const itemId = $(this).parent()[0].id,
          orderId = $(this).parent().parent().parent()[0].id;
    const nameValue = $(this).val()
    sendRequest('/ordered-item/edit/name', {item_id: itemId, name: nameValue, order_id: orderId}, 
    (data) => {
        $(`#${itemId}.item .price`)           .val(data.price);
        $(`#${itemId}.item .discounted-price`).val(data.discountedPrice);
        $(`#${itemId}.item .registercode`)    .val(data.registerCode);
        if(data.name != nameValue){ $(`#${itemId}.item .name`).val(data.name); }
        updateSumOfPrices(orderId);
        updateSumOfDiscountedPrices(orderId)
        if(data.err){
            $(`#${itemId}.item .name`).css('background-color', 'red');
        } else {
            $(`#${itemId}.item .name`).css('background-color', 'silver');
        }
    });
}

function updateItemType(){
    const   itemId  = $(this).parent()[0].id,
            orderId = $(this).parent().parent().parent()[0].id;
    sendRequest('/ordered-item/edit/type', {item_id: itemId, type: $(this).val(), order_id: orderId}, 
    (updatedItem) => {
        $(`#${itemId}.item .price`)             .val(Number(updatedItem.price).toFixed(2));
        $(`#${itemId}.item .discounted-price`)  .val(Number(updatedItem.discountedPrice).toFixed(2));
        updateSumOfPrices(orderId);
        updateSumOfDiscountedPrices(orderId)
    });
    
}

function updateItemQuantity(){
    const   itemId      = $(this).parent()[0].id,
            orderId     = $(this).parent().parent().parent()[0].id;
    sendRequest('/ordered-item/edit/quantity', {item_id: itemId, quantity: $(this).val(), order_id: orderId}, 
    (updatedItem) => {
        $(`#${itemId}.item .price`)             .val(Number(updatedItem.price).toFixed(2));
        $(`#${itemId}.item .discounted-price`)  .val(Number(updatedItem.discountedPrice).toFixed(2));
        updateSumOfPrices(orderId);
        updateSumOfDiscountedPrices(orderId)
    });
}

function updateItemPrice(){
    const   itemId      = $(this).parent()[0].id,
            orderId     = $(this).parent().parent().parent()[0].id;
    sendRequest('/ordered-item/edit/price',{item_id: itemId, price: $(this).val(), order_id: orderId},
    (order) => {
        $(`#${order._id}.order .sum`).val(order.sum);
    }
    
    );
    
}

function restoreItem(orderId, itemId){
    const orderSelector = "#"+orderId+".order .item-container";
    sendRequest('/ordered-item/show', {_id: itemId}, 
    (foundItem) => {
    var promise = new Promise((resolve,reject) => {
        createItemDiv(itemId, orderSelector); 
        resolve();
    });
    promise.then((resolve) => { setItemValues(foundItem); }); 
  });
}

function setItemValues(itemObject){
    const itemSelector = `#${itemObject._id}.item`;
    $(`${itemSelector} .name`)              .val(itemObject.name);
    $(`${itemSelector} .type`)              .val(itemObject.type);
    $(`${itemSelector} .quantity`)          .val(itemObject.quantity);
    $(`${itemSelector} .price`)             .val(Number(itemObject.price).toFixed(2));
    $(`${itemSelector} .discounted-price`)  .val(Number(itemObject.discountedPrice).toFixed(2));
}

function removeItemFromDisplay(itemId){
    sendRequest('/ordered-item/delete', {_id: itemId}, (msg) => { $(`#${itemId}.item`).remove(); });
}