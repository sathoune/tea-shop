function openArchive(){
    $("#master").hide();
    $("#show-archive").html("back to orders");
    $("#show-archive").off("click").on("click", closeArchive);
    createArchiveContainers();
    
    sendRequest("/archive/", {date: new Date()}, callback);
    function callback(data){
        data.forEach(constructArchiveDiv);
    }
}

function closeArchive(){
    $('#master').show();
    $("#show-archive").html("Look at the past");
    $("#show-archive").off("click").on("click", openArchive);
    $('#archive').remove();
}

function createArchiveContainers(){
    var now = new Date();
    var date ={
        year: now.getFullYear(),
        month: (1 + now.getMonth()).toString().padStart(2, '0'),
        day: now.getDate(),
    };
    var newDate = `${date.year}-${date.month}-${date.day}`;

    var archive = "<div id='archive'></div";
    var archiveContainer = "<div id='archived-orders'></div>";
    var archivePanel = "<div id='archive-panel'></div>";
    var dateInput = `<input type="date" id="day-for-display" name="trip-start"
       value='${newDate}' 
       min="2019-01-01" max="2025-12-31">`;

    $('body').append(archive);
    var archiveContainers = [archivePanel, archiveContainer];
    $('#archive').append(archiveContainers);
    $('#archive-panel').append(dateInput);
    $('#day-for-display').on('change' , () => { 
        $('#archived-orders').empty();
        let dayForDisplay = $('#day-for-display').val()
        sendRequest('/archive', {date: dayForDisplay}, (data)=>{
            if(data){
                data.forEach(constructArchiveDiv);   
            } else {
                console.log('this day is not a day');
                //make message
            }
        });
    }); 
    
}

function constructArchiveDiv(orderData){
  var orderDiv = `<div id='${orderData._id}' class='archived-order'></div>`;
  $('#archived-orders').append(orderDiv);
  constructOrderDisplay(orderData);
}

function constructOrderDisplay(orderData){

  var dateInput = `<input type='text' class='order-date' value='${new Date(orderData.created)}' readonly>`;
  var table = `<input type='text' class='order-table' value='${orderData.table}' readonly>`;
  var sum = `<input type='text' class='order-sum' value='${orderData.sum}' readonly>`;
  var discountedSum = `<input type='text' class='order-sum' value='${orderData.discountedSum}' readonly>`;
  var expandButton = `<button class="expand-button">Expand</button>`;
  var inputs = [dateInput, table, sum, discountedSum, expandButton];
  $('#'+orderData._id).append(inputs);
  $(`#${orderData._id} .expand-button`).on("click", expandOrder);

}

function expandOrder(){
    $(this).html("Collapse");
    $(this).off("click").on("click", collapseOrder);
    
    var orderID = $(this).parent()[0].id;
    var itemContainer = `<div class='item-container'></div>`;
    var panelContainer = `<div class='panel'>NAZWA | TYP | ILOŚĆ |  CENA  |  PO ZNIŻCE</div>`;
    // Need labels
    
    $(`#${orderID}.archived-order`).append([panelContainer, itemContainer]);
    sendRequest("/archive/show-ordered-items", {_id: orderID}, callback);
    function callback(data){
        data.forEach((item) => {
            constructItemDisplay(orderID, item);
        });
    }
    
}

function collapseOrder(){
    $(this).html("Expand");
    $(this).off("click").on("click", expandOrder);
    
    var orderID = $(this).parent()[0].id;
    $(`#${orderID}.archived-order .item-container`).remove();
    $(`#${orderID}.archived-order .panel`).remove();
}

function constructItemDisplay(orderID, itemObject){
    var itemDiv = `<div id='${itemObject._id}' class='item-div'></div>`;
    var nameInput = `<input type="text" class="name" value='${itemObject.name}' readonly>`;
    var priceInput = `<input class="price" type="number" value='${itemObject.price}' readonly>`;
    var quantityInput = `<input class="quantity" type="number" value='${itemObject.quantity}' readonly>`;
    var typeInput = `<input class="type" type="text" value='${itemObject.type}' readonly>`;
    var discountedPriceInput = `<input class="discounted-price" type="number" value='${itemObject.discountedPrice}' readonly>`;

    var inputs = [nameInput, typeInput, quantityInput, priceInput, discountedPriceInput];
    $(`#${orderID}.archived-order .item-container`).append(itemDiv);
    $(`#${itemObject._id}.item-div`).append(inputs);
    
}
