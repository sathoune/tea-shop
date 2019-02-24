/* global $ */
/* global item */
/* global order */

function createListenersItemInputs(){
    $('#record-view').on('change',  'div .name',                item.update.name);
    $('#record-view').on('change',  'div .type',                item.update.type);
    $('#record-view').on('change',  'div .quantity',            item.update.quantity);
    $('#record-view').on('keyup',   'div .quantity',            item.update.quantity);
    $('#record-view').on('keyup',   'div .price',               item.update.price);
    $('#record-view').on('keyup',   'div .discounted-price',    item.update.discountedPrice);
}

function createListenersOrderInputs(){
    $('#record-view').on('change',  '.discount',        order.update.discount);
    $('#record-view').on('keydown', '.discount',        order.update.discount);
    $('#record-view').on('change',  '.discount-to-go',  order.update.discountToGo);
    $('#record-view').on('change',  '.table',           order.update.table);
    
}
