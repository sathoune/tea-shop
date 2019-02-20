function collapseItems(orderId){
    $(`#${orderId}.order .item-container`).toggleClass('hidden');
    $(`#${orderId}.order .labels`).toggleClass('hidden');
    if($(`#${orderId}.order .item-container`).hasClass('hidden')){
        $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-down"></i> Pokaż zamówienie <i class="fas fa-angle-down"></i>');
        $(`#${orderId}.order .table`).on("click", (event) => {collapseItems($(event.target).parent().parent()[0].id)});
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-up');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-down');
    } else {
        $(`#${orderId}.order .table`).off("click");
        $(`#${orderId}.order .collapse-order`).html('<i class="fas fa-angle-up"></i> Zwiń zamówienie <i class="fas fa-angle-up"></i>');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-up');
        $(`#${orderId}.order .collapse-order`).toggleClass('cosmic-fusion-down');
    }
}