
 
function sendUpdatedOrder(){
   
    var orderID = $(this).parent().parent()[0].id;
   
    var orderSelector = `#${orderID}.order`;
    var updatedOrder = {
        orderID: orderID,
        values: {
            discount: $(orderSelector + " .discount").val(),
            discountToGo: $(orderSelector + " .discount-to-go").is(":checked"),
            table: $(orderSelector + " .table").val(),
        }
    }
    $.ajax({
        method: 'post',
        url: '/update-order',
        data: JSON.stringify(updatedOrder),
        contentType: "application/json",
        success: function(sum){
            $(orderSelector +" .sum").val(sum); 
        }
    });
    
}


function sendUpdatedOrderForCheckbox(){
   
    var orderID = $(this).parent().parent().parent()[0].id;
   
    var orderSelector = `#${orderID}.order`;
    var updatedOrder = {
        orderID: orderID,
        values: {
            discount: $(orderSelector + " .discount").val(),
            discountToGo: $(orderSelector + " .discount-to-go").is(":checked"),
            table: $(orderSelector + " .table").val(),
        }
    }
     $.ajax({
    	method: 'post',
    	url: '/update-order',
    	data: JSON.stringify(updatedOrder),
    	contentType: "application/json",
    	success: function(data){
    	    console.log(data);   
        }
    });
}
