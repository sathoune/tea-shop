// $ is defined in scope of view
$(document).ready(function(){
    createItem();
    createListenersForInputs();
    
    });


function createListenersForInputs(){
    $('#master').on('change', 'div .name', sendUpdatedItem);
    $('#master').on('change', 'div .type', sendUpdatedItem);
    $('#master').on('change', 'div .quantity', sendUpdatedItem);
    $('#master').on('keydown', 'div .quantity', sendUpdatedItem);
}
