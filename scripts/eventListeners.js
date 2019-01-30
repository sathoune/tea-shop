// $ is defined in scope of view
$(document).ready(function(){
    createListenersItemInputs();
    createHeader();
    createListenersOrderInputs();
    });


function createListenersItemInputs(){
    $('#master').on('change', 'div .name', updateItemName);
    $('#master').on('change', 'div .type', updateItemType);
    $('#master').on('change', 'div .quantity', updateItemQuantity);
    $('#master').on('keyup', 'div .quantity', updateItemQuantity);
}

function createListenersOrderInputs(){
    $('#master').on('change', '.discount', sendUpdatedOrder);
    $('#master').on('keydown', '.discount', sendUpdatedOrder);
    $('#master').on('change', '.discount-to-go', sendUpdatedOrderForCheckbox);
    $('#master').on('change', '.table', updateOrderTable);
    
}