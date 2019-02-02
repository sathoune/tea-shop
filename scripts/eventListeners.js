// $ is defined in scope of view
$(document).ready(function(){
    createListenersItemInputs();
    createHeader();
    createListenersOrderInputs();
    createNavigation();
    findOpenOrders();
    });


function createListenersItemInputs(){
    $('#record-view').on('change', 'div .name', updateItemName);
    $('#record-view').on('change', 'div .type', updateItemType);
    $('#record-view').on('change', 'div .quantity', updateItemQuantity);
    $('#record-view').on('keyup', 'div .quantity', updateItemQuantity);
}

function createListenersOrderInputs(){
    $('#record-view').on('change', '.discount', updateDiscount);
    $('#record-view').on('keydown', '.discount', updateDiscount);
    $('#record-view').on('change', '.discount-to-go', updateToGoDiscount);
    $('#record-view').on('change', '.table', updateOrderTable);
    
}
