function openArchive(){
    $("#master").hide();
    $("#show-archive").html("back to orders");
    $("#show-archive").off("click").on("click", closeArchive);
    createArchiveContainers();
    
    
    sendRequest("/archive/", {}, callback);
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
    var archive = "<div id='archive'></div";
    var archiveContainer = "<div id='archived-orders'></div>";
    var archivePanel = "<div id='archive-panel'></div>";
    $('body').append(archive);
    var archiveContainers = [archivePanel, archiveContainer];
    $('#archive').append(archiveContainers);
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
  $(`#${orderData._id} .expand-button`).on("click", orderData, expandOrder);

}

function expandOrder(event){
    var itemContainer = `<div class='item-container'></div>`;
    var panelContainer = `<div class='panel'>NAZWA | TYP | ILOŚĆ |  CENA  |  PO ZNIŻCE</div>`;
    // Need labels

    $(`#${event.data._id}.archived-order`).append([panelContainer, itemContainer]);
    sendRequest("/archive/show-ordered-items", {orderedItems: event.data.orderedItems}, callback);
    function callback(data){
        data.forEach((item) => {
            constructItemDisplay(event.data._id, item)
        });
    }

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
