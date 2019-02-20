function openArchive(){
    hideMainContainers();
    $("#show-archive").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
    $("#show-archive").off("click").on("click", closeArchive);
    createArchiveContainers();
    sendRequest("/archive/", {date: new Date()}, (data) => {
        var sum = 0;
        var discountedSum = 0;
        data.forEach((order) => {
            if(order.closed){
               if(order.sum){ sum+= Number(order.sum); } 
               if(order.discountedSum){ discountedSum += Number(order.discountedSum); }
               constructArchiveDiv(order);   
            }
        });
        setSums(sum, discountedSum);
    });
}

function closeArchive(){
    $('#record-view').show();
    $("#show-archive").html(`<i class="fas fa-archive"></i> Archiwum <i class="fas fa-archive"></i>`);
    $("#show-archive").off("click").on("click", openArchive);
    $('#archive').remove();
    showMainContainers();
}

function createArchiveContainers(){
    
    const ids = {
        archiveContainer:          'archive',
        archivePanel:              'archive-panel',
        archivedOrdersContainer:   'archived-orders',
    };
    const   archiveContainer            = `<div id='${ids.archiveContainer}' class='main-container'></div`,
            archivedOrdersContainer     = `<div id='${ids.archivedOrdersContainer}'></div>`,
            archivePanel                = `<div id='${ids.archivePanel}'></div>`;
   
    $('body').append(archiveContainer);
    const expandAllButton = `<button id='expand-all-button' class="expand-button">Rozwiń wszystkie <i class="fas fa-search-plus"></i></button>`;
    const   dateInput           = `<input                   id="day-for-display"    type="date" name="trip-start"   value='${getDate()}' min="2019-01-01" max="2025-12-31">`,
            sumInput            = `<input class="day-sum"   id='day-sum'            type="number"                   value='0'           readonly>`,
            discountedSumInput  = `<input class="day-sum"   id='discounted-day-sum' type="number"                   value='0'           readonly>`,
            dateLabel           = `<input class='date-label'                        type='text'                     value='Otwarto'     readonly>`,
            tableLabel          = `<input class='date-label'                        type='text'                     value='Stolik'      readonly>`,
            sumLabel            = `<input class='date-label'                        type='text'                     value='Suma'        readonly>`,
            discountedSumLabel  = `<input class='date-label'                        type='text'                     value='Po zniżce'   readonly>`;
    const archivedOrderLabels = `<div id='archived-orders-labels' readonly></div>`;

    const dayDiv = `<div class='thingies'><input type='text' class='date-label' value='Data' readonly>`+dateInput+`<input type='text' class='date-label' value='Suma dnia' readonly>`+sumInput+`<input type='text' class='date-label' value='Po zniżce' readonly>`+discountedSumInput+`</div>`;
    
    $('#archive').append([archivePanel, archivedOrdersContainer]);
    $('#archive-panel').append([dayDiv, archivedOrderLabels]);
    $(`#archived-orders-labels`).append([dateLabel, tableLabel, sumLabel, discountedSumLabel, expandAllButton]);
    $(`#expand-all-button`).on("click", expandAll);
    $('#day-for-display').on('change' , generateDay);
}

function generateDay(){
    $('#archived-orders').empty();
        let dayForDisplay = $('#day-for-display').val()
        sendRequest('/archive', {date: dayForDisplay}, 
        (data) => {
            if(data){
                let sum = 0;
                let discountedSum = 0;
                data.forEach((item) => {
                   if(item.sum){ sum+= Number(item.sum); } 
                   if(item.discountedSum){ discountedSum += Number(item.discountedSum);}
                });
                data.forEach(constructArchiveDiv); 
                setSums(sum, discountedSum);
            } else {
                setSums(0,0);
                console.log('this day is not a day');
                //make message
            }
        });
}

function constructArchiveDiv(orderData){
    const orderDiv = `<div id='${orderData._id}' class='archived-order'></div>`;
    $('#archived-orders').append(orderDiv);
    constructOrderDisplay(orderData);
}

function constructOrderDisplay(orderData){
    if(!orderData.table) { orderData.table = '' };
    const date = new Date(orderData.createdAt).getHours()+":"+new Date(orderData.createdAt).getMinutes()+":"+new Date(orderData.createdAt).getSeconds();
    const   summaryDiv      = `<div class='div-summary'></div>`
    const   sendBackButton  = `<button class='send-back' onclick='sendOrderBack("${orderData._id}")'><i class="fas fa-long-arrow-alt-left"></i> Otwórz ponownie</button>`,
            dateInput       = `<input type='text' class='order-date' value='${date}' readonly>`,
            table           = `<input type='text' class='order-table' value='${orderData.table}' readonly>`,
            sum             = `<input type='text' class='order-sum' value='${Number(orderData.sum).toFixed(2)}' readonly>`,
            discountedSum   = `<input type='text' class='order-sum' value='${Number(orderData.discountedSum).toFixed(2)}' readonly>`,
            expandButton    = `<button class="expand-button">Rozwiń <i class="fas fa-search-plus"></i></button>`;
    const   inputs          = [ sendBackButton, dateInput, table, sum, discountedSum, expandButton ];
    $('#'+orderData._id).append(summaryDiv);
    $(`#${orderData._id} .div-summary`).append(inputs);
    $(`#${orderData._id} .expand-button`).on("click", expandOrder);
}

function expandOrder(){
    $(this).html(`Zwiń <i class="fas fa-search-minus"></i>`);
    $(this).off("click").on("click", collapseOrder);
    const orderID = $(this).parent().parent()[0].id;
    const itemContainer = `<div class='item-container'></div>`;
    const panelContainer = `<div class='panel'><input type='text' class='name' value='Nazwa' readonly><input type='text' class='type' value='Typ' readonly><input type='text' class='quantity' value='Ilość' readonly><input type='text' class='price' value='Cena' readonly><input type='text' class='price' value='Po zniżce' readonly></div>`;
    // Need labels
    $(`#${orderID}.archived-order`).append([panelContainer, itemContainer]);
    sendRequest("/archive/show-ordered-items", {_id: orderID}, (data) => 
    { data.forEach( (item) => { constructItemDisplay(orderID, item); }); });
}

function collapseOrder(){
    $(this).html(`Rozwiń <i class="fas fa-search-plus"></i>`);
    $(this).off("click").on("click", expandOrder);
    const orderId = $(this).parent().parent()[0].id;
    $(`#${orderId}.archived-order .item-container`).remove();
    $(`#${orderId}.archived-order .panel`).remove();
}

function constructItemDisplay(orderId, itemObject){
    const   itemDiv             = `<div id='${itemObject._id}' class='item-div'></div>`,
            nameInput           = `<input type="text" class="name" value='${itemObject.name}' readonly>`,
            priceInput          = `<input class="price" type="number" value='${Number(itemObject.price).toFixed(2)}' readonly>`,
            quantityInput       = `<input class="quantity" type="number" value='${itemObject.quantity}' readonly>`,
            typeInput           = `<input class="type" type="text" value='${itemObject.type}' readonly>`,
            discountedPriceInput= `<input class="discounted-price" type="number" value='${Number(itemObject.discountedPrice).toFixed(2)}' readonly>`;
    const inputs = [nameInput, typeInput, quantityInput, priceInput, discountedPriceInput];
    $(`#${orderId}.archived-order .item-container`).append(itemDiv);
    $(`#${itemObject._id}.item-div`).append(inputs);
}

function setSums(sum, discountedSum){
    $('#archive-panel #day-sum').val(Number(sum).toFixed(2));
    $('#archive-panel #discounted-day-sum').val(Number(discountedSum).toFixed(2));
}

function sendOrderBack(orderId){
    sendRequest('/archive/reopen', {_id: orderId}, (data) => { $(`#${orderId}.archived-order`).remove(); });
}

function expandAll(){
    // change text
    var expandButtons = $('.archived-order .expand-button');
    for(var i=0; i<expandButtons.length; i++){
        $(expandButtons[i]).trigger("click");
    }
}

function hideMainContainers(){
    var mainContainers = $('.main-container');
    for(var i=0; i<mainContainers.length;i++){ $(mainContainers[i]).hide(); }
}
function showMainContainers(){
    var mainContainers = $('.main-container');
    for(var i=0; i<mainContainers.length;i++){ $(mainContainers[i]).show(); }
}


function getDate(){
    const now = new Date();
    const date ={
        year: now.getFullYear(),
        month: (1 + now.getMonth()).toString().padStart(2, '0'),
        day: now.getDate().toString().padStart(2, '0'),
    };
    return `${date.year}-${date.month}-${date.day}`;
}