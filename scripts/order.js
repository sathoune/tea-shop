function orderTable(tableValue, orderId){
    const tableColors = {
        morocco:    "#4ebbff",
        oriental:   "#eb842a",
        colonial:   "#ba232b",
        outside:    "#2ab015",
        scene:      "#e00007",
        other:      "#fcd912",
    }
    if(tableValue==''){
        $(`#${orderId}.order`).css('order', 0);
    }
    else if('m1' == tableValue){
        $(`#${orderId}.order`).css('order', 10);
        $(`#${orderId}.order .table`).css('background-color', tableColors.morocco);
    }
    else if('m2' == tableValue){
        $(`#${orderId}.order`).css('order', 12);
        $(`#${orderId}.order .table`).css('background-color', tableColors.morocco);
    }
    else if('m3' ==tableValue){
        $(`#${orderId}.order`).css('order', 14);
        $(`#${orderId}.order .table`).css('background-color', tableColors.morocco);
    }
    else if('m4' == tableValue){
        $(`#${orderId}.order`).css('order', 16);
        $(`#${orderId}.order .table`).css('background-color', tableColors.morocco);
    }
    else if('k1' == tableValue){
        $(`#${orderId}.order`).css('order', 20);
        $(`#${orderId}.order .table`).css('background-color', tableColors.colonial);
    }
    else if('k2' == tableValue){
        $(`#${orderId}.order`).css('order', 22);
        $(`#${orderId}.order .table`).css('background-color', tableColors.colonial);
    }
    else if('k3' == tableValue){
        $(`#${orderId}.order`).css('order', 24);
        $(`#${orderId}.order .table`).css('background-color', tableColors.colonial);
    }
    else if('t' == tableValue){
        $(`#${orderId}.order`).css('order', 26);
        $(`#${orderId}.order .table`).css('background-color', tableColors.scene);
    }
    else if('k4' == tableValue){
        $(`#${orderId}.order`).css('order', 28);
        $(`#${orderId}.order .table`).css('background-color', tableColors.colonial);
    }
    else if('k5' == tableValue){
        $(`#${orderId}.order`).css('order', 30);
        $(`#${orderId}.order .table`).css('background-color', tableColors.colonial);
    }
    else if('k6' == tableValue){
        $(`#${orderId}.order`).css('order', 32);
        $(`#${orderId}.order .table`).css('background-color', tableColors.colonial);
    }
    else if('o1' == tableValue){
        $(`#${orderId}.order`).css('order', 40);
        $(`#${orderId}.order .table`).css('background-color', tableColors.oriental);
    }
    else if('o2' == tableValue){
        $(`#${orderId}.order`).css('order', 42);
        $(`#${orderId}.order .table`).css('background-color', tableColors.oriental);
    }
    else if('o3' == tableValue){
        $(`#${orderId}.order`).css('order', 44);
        $(`#${orderId}.order .table`).css('background-color', tableColors.oriental);
    }
    else if(/out./.test(tableValue)){
        $(`#${orderId}.order`).css('order', 8);
        $(`#${orderId}.order .table`).css('background-color', tableColors.outside);
    }
    else{
        $(`#${orderId}.order`).css('order', 5);
        $(`#${orderId}.order .table`).css('background-color', tableColors.other);
    }
}

function collapseItems(orderId){
    $(`#${orderId}.order .item-container`).toggleClass('hidden');
    $(`#${orderId}.order .labels`).toggleClass('hidden');
    if($(`#${orderId}.order .item-container`).hasClass('hidden')){
        $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-down"></i> Pokaż zamówienie <i class="fas fa-angle-down"></i>');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-up');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-down');
    } else {
        $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-up"></i> Zwiń zamówienie <i class="fas fa-angle-up"></i>');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-up');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-down');
    }
}