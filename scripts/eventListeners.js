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
    $('#master').on('keydown', 'div .quantity', sendUpdatedItem);
}

function createListenersOrderInputs(){
    $('#master').on('change', 'div .discount', sendUpdatedOrder);
    
}