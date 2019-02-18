
function createListenersItemInputs(){
    $('#record-view').on('change',  'div .name',                updateItemName);
    $('#record-view').on('change',  'div .type',                updateItemType);
    $('#record-view').on('change',  'div .quantity',            updateItemQuantity);
    $('#record-view').on('keyup',   'div .quantity',            updateItemQuantity);
    $('#record-view').on('keyup',   'div .price',               updateItemPrice);
    $('#record-view').on('keyup',   'div .discounted-price',    updateItemDiscountedPrice);
}

function createListenersOrderInputs(){
    $('#record-view').on('change',  '.discount',        updateDiscount);
    $('#record-view').on('keydown', '.discount',        updateDiscount);
    $('#record-view').on('change',  '.discount-to-go',  updateToGoDiscount);
    $('#record-view').on('change',  '.table',           updateOrderTable);
    
}
