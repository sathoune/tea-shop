
function createItem(parentID){
    var parentSelector = "#"+parentID+".order .item-container";
    $.ajax({
        	method: 'post',
        	url: '/ordered-item/new',
        	data: JSON.stringify({orderID: parentID}),
        	contentType: "application/json",
        	success: function(orderedItem){
    			createItemDiv(orderedItem._id, parentSelector)
            }
                
        });
}

function createItemDiv(item_id, parentSelector){
    var div = `<div id=${item_id} class='item'></div>`;     
    
    $(parentSelector).append(div);  
    insertInputsInto($(`#${item_id}`));
    
}

function insertInputsInto(div){
    var nameInput = '<input type="text" class="name" list="tees">'
    var codeInput = '<input type="text" class="registerCode">';
    var priceInput = '<input class="price" type="text">';
    var quantityInput = '<input class="quantity" type="number" name="quantity" min="0" value="1">';
    var typeInput = '<select class="type">\
                <option value="sztuka">sztuka</option>\
                <option value="czajnik">czajnik</option>\
                <option value="gaiwan">gaiwan</option>\
                <option value="opakowanie">opakowanie</option>\
                <option value="gram">gram</option>\
                </select>';
                
    var inputElements = [
            codeInput,
            nameInput,
            typeInput,
            quantityInput,
            priceInput,
        ];
        
    div.append(inputElements);
    
}

        

 
function sendUpdatedItem(){
    var itemID = $(this).parent()[0].id;
    var updatedItem = {
        id: itemID,
    
        name: $(`#${itemID}.item .name`).val(),
        quantity: $(`#${itemID}.item .quantity`).val(),
        type: $(`#${itemID}.item .type`).val(),
        price: $(`#${itemID}.item .price`).val(),
    
    };
   
    $.ajax({
    	method: 'post',
    	url: '/ordered-item/edit',
    	data: JSON.stringify(updatedItem),
    	contentType: "application/json",
    	success: function(data){
    	   
            $(`#${itemID}.item .price`).val(data.price);
            $(`#${itemID}.item .registercode`).val(data.registerCode);
        }
    });
}


 