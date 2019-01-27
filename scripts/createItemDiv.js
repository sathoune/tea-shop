
function createItem(){
    $.ajax({
        	method: 'post',
        	url: '/create-item',
        	contentType: "application/json",
        	success: function(orderedItem){
    			createItemDiv(orderedItem._id)
            }
                
        });
}

function createItemDiv(item_id){
    var div = `<div id=${item_id}></div>`;     
    
    $("#master").append(div);  
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
    div.append(codeInput, nameInput, typeInput, quantityInput, priceInput);
    
}

        
