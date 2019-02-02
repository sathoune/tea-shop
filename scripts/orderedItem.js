// create item

function createItem(parentID){
    var parentSelector = "#"+parentID+".order .item-container";
    sendRequest('/ordered-item/new', {orderID: parentID}, 
    (emptyItem) => { createItemDiv(emptyItem._id, parentSelector);});
    
}

function createItemDiv(item_id, parentSelector){
    var div = `<div id=${item_id} class='item'></div>`;     
    
    $(parentSelector).append(div);  
    insertInputsInto($(`#${item_id}`));
    
}

function insertInputsInto(div){
  const itemID = div[0].id;
  var deleteButton    = `<button class='delete-button' onclick='deleteItem("${itemID}")'>x</button>`;  
  var nameInput       = '<input type="text" class="name" list="tees">';
  var codeInput       = '<input type="text" class="registerCode" readonly>';
  var priceInput      = '<input class="price" type="number" readonly>';
  var quantityInput   = '<input class="quantity" type="number" name="quantity" min="0" value="1">';
  var typeInput       = `<select class="type">
                          <option value="sztuka">sztuka</option>
                          <option value="czajnik">czajnik</option>
                          <option value="gaiwan">gaiwan</option>
                          <option value="opakowanie">opakowanie</option>
                          <option value="gram">gram</option>
                        </select>`;
  var hintInput = '<input class="hint" type="text">';
  var discountedPriceInput = '<input class="discounted-price" type="number" readonly>';
  var inputElements = [
    deleteButton,
    codeInput,
    nameInput,
    typeInput,
    quantityInput,
    priceInput,
    hintInput,
    discountedPriceInput,
  ];
      
    div.append(inputElements);
    
}

        



// editing scripts
 

function updateItemName(){
    var itemID = $(this).parent()[0].id;
    var orderID = $(this).parent().parent().parent()[0].id;
    var name = $(this).val()
    sendRequest('/ordered-item/update-name', {item_id: itemID, name: name, order_id: orderID}, 
    (data) => {
      if(data){
        $(`#${itemID}.item .price`)           .val(data.price);
        $(`#${itemID}.item .discounted-price`).val(data.discountedPrice);
        $(`#${itemID}.item .registercode`)    .val(data.registerCode);
        if(data.name != name){
          $(`#${itemID}.item .name`).val(data.name);
        }
        updateSumOfPrices(orderID);
        updateSumOfDiscountedPrices(orderID)
  
      } else { $(`#${itemID}.item .name`).val("");}
    });
}

function updateItemType(){
  var itemID = $(this).parent()[0].id;
  var orderID = $(this).parent().parent().parent()[0].id;

    sendRequest('/ordered-item/update-type', {item_id: itemID, type: $(this).val(), order_id: orderID}, 
    (updatedItem) => {
      $(`#${itemID}.item .price`)             .val(updatedItem.price);
      $(`#${itemID}.item .discounted-price`)  .val(updatedItem.discountedPrice);

      updateSumOfPrices(orderID);
      updateSumOfDiscountedPrices(orderID)
    });
    
}

function updateItemQuantity(){
  var itemID = $(this).parent()[0].id;
  var orderID = $(this).parent().parent().parent()[0].id;

    sendRequest('/ordered-item/update-quantity', {item_id: itemID, quantity: $(this).val(), order_id: orderID}, 
    (updatedItem) => {
        $(`#${itemID}.item .price`)             .val(updatedItem.price);
        $(`#${itemID}.item .discounted-price`)  .val(updatedItem.discountedPrice);

        updateSumOfPrices(orderID);
        updateSumOfDiscountedPrices(orderID)
      
      
    });
}

function restoreItem(parentID, itemID){
    var parentSelector = "#"+parentID+".order .item-container";
    sendRequest('/ordered-item/show', {_id: itemID}, (foundItem) => {
    var promise = new Promise((resolve,reject) => {
      createItemDiv(itemID, parentSelector); 
      resolve();
    });
    promise.then((resolve) => {
      setValues(foundItem);          
      }); 
    });
    
}

function setValues(item){
  var itemSelector = `#${item._id}.item`;
  $(itemSelector + ' .name')              .val(item.name);
  $(itemSelector + ' .type')              .val(item.type);
  $(itemSelector + ' .quantity')          .val(item.quantity);
  $(itemSelector + ' .price')             .val(item.price);
  $(itemSelector + ' .discounted-price')  .val(item.discountedPrice);
}

function deleteItem(itemID){
  sendRequest('/ordered-item/delete', {_id: itemID}, (msg) => {
    $(`#${itemID}.item`).remove();
  });
}