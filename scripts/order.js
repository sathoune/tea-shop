// Dynamically create order


function orderTable(tableValue, orderId){
    if(tableValue==''){
        $(`#${orderId}.order`).css('order', 0);
    }
    else if('m1' == tableValue){
        $(`#${orderId}.order`).css('order', 10);
    }
    else if('m2' == tableValue){
        $(`#${orderId}.order`).css('order', 12);
    }
    else if('m3' ==tableValue){
        $(`#${orderId}.order`).css('order', 14);
    }
    else if('m4' == tableValue){
        $(`#${orderId}.order`).css('order', 16);
    }
    else if('k1' == tableValue){
        $(`#${orderId}.order`).css('order', 20);
    }
    else if('k2' == tableValue){
        $(`#${orderId}.order`).css('order', 22);
    }
    else if('k3' == tableValue){
        $(`#${orderId}.order`).css('order', 24);
    }
    else if('t' == tableValue){
        $(`#${orderId}.order`).css('order', 26);
    }
    else if('k4' == tableValue){
        $(`#${orderId}.order`).css('order', 28);
    }
    else if('k5' == tableValue){
        $(`#${orderId}.order`).css('order', 30);
    }
    else if('k6' == tableValue){
        $(`#${orderId}.order`).css('order', 32);
    }
    else if('o1' == tableValue){
        $(`#${orderId}.order`).css('order', 40);
    }
    else if('o2' == tableValue){
        $(`#${orderId}.order`).css('order', 42);
    }
    else if('o3' == tableValue){
        $(`#${orderId}.order`).css('order', 44);
    }
    else if(/out./.test(tableValue)){
        $(`#${orderId}.order`).css('order', 8);
    }
    else{
        $(`#${orderId}.order`).css('order', 5);
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

function testSomething(orderId){
    sendRequest("/order/test", {orderId: orderId}, (data) =>{
       console.log('done'); 
    });
    
}