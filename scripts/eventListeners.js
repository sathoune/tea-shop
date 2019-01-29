// $ is defined in scope of view
$(document).ready(function(){
    createListenersItemInputs();
    createHeader();
    createListenersOrderInputs();
    });


function createListenersItemInputs(){
    $('#master').on('change', 'div .name', sendUpdatedItem);
    $('#master').on('change', 'div .type', sendUpdatedItem);
    $('#master').on('change', 'div .quantity', sendUpdatedItem);
    $('#master').on('keyup', 'div .quantity', sendUpdatedItem);
}

function createListenersOrderInputs(){
    $('#master').on('change', '.discount', sendUpdatedOrder);
    $('#master').on('keydown', '.discount', sendUpdatedOrder);
    $('#master').on('change', '.discount-to-go', sendUpdatedOrderForCheckbox);
    $('#master').on('change', '.table', sendUpdatedOrder);
    
}