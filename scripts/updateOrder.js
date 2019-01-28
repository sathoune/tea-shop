
 
function sendUpdatedOrder(){
    var orderID = $(this).parent().parent()[0].id;
    var orderSelector = `#${orderID}.order`;
    var updatedOrder = {
        orderID: orderID,
        values: {
            discount: $(orderSelector + " .discount").val(),
            discountToGo: $(orderSelector + " .discountToGo").is(":checked"),
            table: $(orderSelector + " .table").val(),
        }
    }
     $.ajax({
    	method: 'post',
    	url: '/update-order',
    	data: JSON.stringify(updatedOrder),
    	contentType: "application/json",
    	success: function(data){
    	    console.log("hurray" + data);   
        }
    });
}


 