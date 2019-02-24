
function createListenersItemInputs(){
    $('#record-view').on('change',  'div .name',                item.update.name);
    $('#record-view').on('change',  'div .type',                item.update.type);
    $('#record-view').on('change',  'div .quantity',            item.update.quantity);
    $('#record-view').on('keyup',   'div .quantity',            item.update.quantity);
    $('#record-view').on('keyup',   'div .price',               item.update.price);
    $('#record-view').on('keyup',   'div .discounted-price',    item.update.discountedPrice);
}

function createListenersOrderInputs(){
    $('#record-view').on('change',  '.discount',        updateDiscount);
    $('#record-view').on('keydown', '.discount',        updateDiscount);
    $('#record-view').on('change',  '.discount-to-go',  updateToGoDiscount);
    $('#record-view').on('change',  '.table',           updateOrderTable);
    
}
