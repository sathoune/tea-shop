function createOrder(){
    sendRequest('/order/new', {}, 
    (emptyOrder) => {createOrderContainer(emptyOrder._id);});
}

function createOrderContainer(orderId, itemsQuantity=4){
    const div = `<div id=${orderId} class='order'></div>`;     
    $("#order-display").prepend(div);
    
    createOrderTopPanel(orderId);
    createOrderLabelsContainer(orderId); 
    createOrderBottomPanel(orderId);
    createOrderItemPanel(orderId, itemsQuantity);
    
    $(`#${orderId}.order`).css("order", 0);
    window.location.href = `#${orderId}`;
}

function createOrderTopPanel(orderId){
    const   topPanelDiv = `<div class="top-panel"></div>`;
    $(`#${orderId}.order`).append(topPanelDiv);
    $(`#${orderId}.order .top-panel`).append(orderHTML.createTopPanelInputs(orderId));
}

function createOrderLabelsContainer(orderId){
    const labelsDiv = `<div class="labels"></div>`;
    $(`#${orderId}.order`).append(labelsDiv);
    $(`#${orderId}.order .labels`).append(orderHTML.createOrderLabels(orderId));
}

function createOrderBottomPanel(orderId){
    const   bottomPanelContainer = `<div class="bottom-panel"></div>`;
    $(`#${orderId}.order`).append(bottomPanelContainer);
    $(`#${orderId}.order .bottom-panel`).append(orderHTML.createBottomPanelInputs(orderId));
}

function createOrderItemPanel(orderId, itemsQuantity){
    const orderPanelDiv = `<div class='item-container'></div>`
    $(`#${orderId}.order`).append(orderPanelDiv);
    for(var i=0; i<itemsQuantity; i++){ createItem(orderId); }
}
 
 
const orderHTML = {
    createTopPanelInputs: (orderId) => {
        const icons = {

            angleUp: `<i class="fas fa-angle-up"></i>`,
            pencil: `<i class="fas fa-pencil-alt"></i>`,
        };
        const   tableInput              = "<input type='text' class='table' placeholder='stolik'>",
                discountInput           = "<input type='text' class='discount-label' value='Zniżka:'readonly><input type='number' class='discount' value='0' min='0' max='100' step='5'>",
                percentLabel            = "<input class='percent' type='text' value='%' readonly>",
                discountToGoCheckbox    = "<label class='to-go-button'><input class='discount-to-go' type='checkbox' name='checkbox' value='discountToGo'>na wagę</label>",
                sendButton              = `<button onclick='closeOrder("${orderId}")'       class='send-button'      >Zamknij zamówienie ${icons.pencil}</button>`,
                collapseButton          = `<button onclick='collapseItems("${orderId}")'    class='collapse-order cosmic-fusion-up'>${icons.angleUp} Zwiń zamówienie ${icons.angleUp}</button>`;
        return [tableInput, collapseButton, discountInput, discountToGoCheckbox, percentLabel, sendButton, ];
    },
    
    createOrderLabels: (orderId) => {
        const plus = `<i class="fas fa-plus"></i>`;
        const   addItemButton           = `<button onclick='createItem("${orderId}")' class='add-item-button'  >${plus}</button>`,
                labelCode               = `<input type='text' class='register-code'     value='Kod'         readonly>`,
                labelName               = `<input type='text' class='name'              value='Nazwa'       readonly>`,
                labelType               = `<input type='text' class='type'              value='Typ'         readonly>`,
                labelQuantity           = `<input type='text' class='quantity'          value='Ilość'       readonly>`,
                labelPrice              = `<input type='text' class='price'             value='Cena'        readonly>`,
                labelHint               = `<input type='text' class='hint'              value='Uwagi'       readonly>`,
                labelDiscountedPrice    = `<input type='text' class='discounted-price'  value='Po zniżce'   readonly>`;
        return [addItemButton, labelCode, labelName, labelType, labelQuantity, labelPrice, labelHint, labelDiscountedPrice, ];
    },
    
    createBottomPanelInputs: (orderId) => {
        const   dumpster = `<i class="fas fa-dumpster"></i>`;
        const   deleteButton        = `<button class='delete-button' onclick='deleteOrder("${orderId}")'>${dumpster} Usuń zamówienie ${dumpster}</button>`,  
                sumLabel            = "<input type='text'   class='sum-label'               value='Suma'            readonly>",
                sumInput            = "<input type='number' class='sum'                     value='0'               readonly>",
                discountedSumLabel  = "<input type='text'   class='discounted-sum-label'    value='Suma po zniżce'  readonly>",
                discountedSumInput  = "<input type='number' class='discounted-sum'          value='0'               readonly>";
        return [deleteButton, sumLabel, sumInput, discountedSumLabel, discountedSumInput, ];
    },
};