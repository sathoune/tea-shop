
function createOrder(){
    sendRequest('/order/new', {}, 
    (emptyOrder) => {createOrderDiv(emptyOrder._id);});
}



function createNavigation(){
    const   topPanel = "<div id='top-panel'></div>",
            createOrder = `<button id='create-order' onclick='createOrder()'><i class="fas fa-folder-plus"></i> Nowe zamówienie <i class="fas fa-folder-plus"></i></button>`,
            orderDiv = "<div id='order-display'></div>";
    $('#record-view').append([topPanel, orderDiv]);
    $('#top-panel').append(createOrder);
}

function createOrderDiv(orderId, itemsQuantity=4){
    const div = `<div id=${orderId} class='order'></div>`;     
    $("#order-display").prepend(div);
    createOrderTopPanel(orderId);
    createOrderLabels(orderId); 
    createOrderBottomPanel(orderId);
    createOrderItemPanel(orderId, itemsQuantity);
    $(`#${orderId}.order`).css("order", 0);
}

function createOrderTopPanel(orderId){
    const   topPanelDiv = `<div class="top-panel"></div>`;
    const   tableInput = "<input type='text' class='table' placeholder='stolik'>",
            discountInput = "<input type='text' class='discount-label' value='Zniżka:'readonly><input type='number' class='discount' value='0' min='0' max='100'><input class='percent' type='text' value='%' readonly>",
            discountToGoCheckbox = "<label class='to-go-button'><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>na wagę</label>",
            sendButton = `<button class='send-button' onclick='closeOrder("${orderId}")'>Zamknij zamówienie <i class="fas fa-pencil-alt"></i>

</button>`,
            addItemButton = `<button class='add-item-button' onclick='createItem("${orderId}")'><i class="fas fa-plus"></i> Dodaj rząd</button>`,
            collapseButton = `<button class='collapse-order cosmic-fusion-up' onclick='collapseItems("${orderId}")'>
            <i class="fas fa-angle-up"></i> Zwiń zamówienie <i class="fas fa-angle-up"></i></button>`
    const TopPanelElements = [
            addItemButton,
            tableInput,
            collapseButton,
            discountInput, 
            discountToGoCheckbox, 
            sendButton,
        ];
    $(`#${orderId}.order`).append(topPanelDiv);
    $(`#${orderId}.order .top-panel`).append(TopPanelElements);
}

function createOrderLabels(orderId){
    const labelsDiv = `<div class="labels"></div>`;
    const   labelCode = `<input type='text' class='registerCode' value='Kod' readonly>`,
            labelName = `<input type='text'  class='name' value='Nazwa' readonly>`,
            labelType = `<input type='text'  class='type' value='Typ' readonly>`,
            labelQuantity = `<input type='text'  class='quantity' value='Ilość' readonly>`,
            labelPrice = `<input type='text'  class='price' value='Cena' readonly>`,
            labelHint = `<input type='text'  class='hint' value='Uwagi' readonly>`,
            labelDiscountedPrice = `<input type='text' class='discounted-price' value='Po zniżce' readonly>`;
    const labels = [
            labelCode,
            labelName,
            labelType,
            labelQuantity,
            labelPrice,
            labelHint,
            labelDiscountedPrice,
        ];
    $(`#${orderId}.order`).append(labelsDiv);
    $(`#${orderId}.order .labels`).append(labels);
}


function createOrderBottomPanel(orderId){
    const   bottomPanelDiv = `<div class="bottom-panel"></div>`;
    const   deleteButton    = `<button class='delete-button' onclick='deleteOrder("${orderId}")'>
    <i class="fas fa-dumpster"></i> Usuń zamówienie <i class="fas fa-dumpster"></i></button>`,  
            sumInput = "<input type='text' class='sum-label' value='Suma' readonly><input type='number' value='0' class='sum' readonly>",
            discountedSumInput = "<input type='text' class='discounted-sum-label' value='Suma po zniżce' readonly><input type='number' value='0' class='discounted-sum' readonly>"
    const bottomPanelElements = [
            deleteButton, 
            sumInput,
            discountedSumInput,
        ];
    $(`#${orderId}.order`).append(bottomPanelDiv);
    $(`#${orderId}.order .bottom-panel`).append(bottomPanelElements);
}

function createOrderItemPanel(orderId, itemsQuantity){
    const orderPanelDiv = `<div class='item-container'></div>`
    $(`#${orderId}.order`).append(orderPanelDiv);
    for(var i=0; i<itemsQuantity; i++){
        createItem(orderId);
    }
}
 