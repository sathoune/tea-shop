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
    $("#show-archive").html(`<i class="fas fa-archive"></i> Look at the past <i class="fas fa-archive"></i>`);
    $("#show-archive").off("click").on("click", openArchive);
    $('#archive').remove();
    showMainContainers();
}

function createArchiveContainers(){
    const now = new Date();
    const date ={
        year: now.getFullYear(),
        month: (1 + now.getMonth()).toString().padStart(2, '0'),
        day: now.getDate().toString().padStart(2, '0'),
    };
    const newDate = `${date.year}-${date.month}-${date.day}`;

    const   archive             = "<div id='archive' class='main-container'></div";
    const   archiveContainer    = "<div id='archived-orders'></div>",
            archivePanel        = "<div id='archive-panel'></div>";
    const   archiveContainers   = [archivePanel, archiveContainer];
    const   dateInput           = `<input type="date" id="day-for-display" name="trip-start"
       value='${newDate}' min="2019-01-01" max="2025-12-31">`;
    $('body').append(archive);

    $('#archive').append(archiveContainers);
    $('#archive-panel').append(dateInput);
    $('#day-for-display').on('change' , () => { 
        $('#archived-orders').empty();
        let dayForDisplay = $('#day-for-display').val()
        sendRequest('/archive', {date: dayForDisplay}, 
        (data) => {
            if(data){
                var sum = 0;
                var discountedSum = 0;
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
    }); 
}

function constructArchiveDiv(orderData){
  const orderDiv = `<div id='${orderData._id}' class='archived-order'></div>`;
  $('#archived-orders').append(orderDiv);
  constructOrderDisplay(orderData);
}

function constructOrderDisplay(orderData){
    if(!orderData.table) { orderData.table = '' };
    const   summaryDiv      = `<div class='div-summary'></div>`
    const   sendBackButton  = `<button class='send-back' onclick='sendOrderBack("${orderData._id}")'><i class="fas fa-long-arrow-alt-left"></i> Otwórz ponownie</button>`,
            dateInput       = `<input type='text' class='order-date' value='${new Date(orderData.created)}' readonly>`,
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
    $('#archive-panel .day-sum').remove();
    const   sumInput            = `<input class="day-sum" type="number" value='${Number(sum).toFixed(2)}' readonly>`,
            discountedSumInput  = `<input class="day-sum" type="number" value='${Number(discountedSum).toFixed(2)}' readonly>`;
    $('#archive-panel').append([sumInput, discountedSumInput]);
}

function sendOrderBack(orderId){
    sendRequest('/archive/reopen', {_id: orderId}, (data) => { $(`#${orderId}.archived-order`).remove(); });
}


function hideMainContainers(){
    var mainContainers = $('.main-container');
    for(var i=0; i<mainContainers.length;i++){
        $(mainContainers[i]).hide();
    }
}
function showMainContainers(){
    var mainContainers = $('.main-container');
    for(var i=0; i<mainContainers.length;i++){
        $(mainContainers[i]).show();
    }
}