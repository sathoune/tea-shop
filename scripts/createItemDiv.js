
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
    var div = `<div id=${item_id}><input type='text'></div>`;     
    
    $("body").append(div);  
    
};