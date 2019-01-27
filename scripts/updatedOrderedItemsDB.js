
 
function sendUpdatedItem(){
    console.log("sendupdatedItem");
    var parentDivID = $(this).parent()[0].id;
    console.log(parentDivID);
    var updatedItem = {
        name: $(`#${parentDivID} .name`).val(),
        quantity: $(`#${parentDivID} .quantity`).val(),
        type: $(`#${parentDivID} .type`).val(),
        price: $(`#${parentDivID} .price`).val(),
    };
    // $.ajax({
    // 	method: 'post',
    // 	url: '/update-item',
    // 	data: JSON.stringify(updatedItem),
    // 	contentType: "application/json",
    // 	success: function(){
    // 	    console.log("done");
    // 	}
    // });
}


//  $.ajax({
//     	method: 'post',
//     	url: '/data',
//     	data: JSON.stringify({ name: $("#666 .name").val() }),
//     	contentType: "application/json",
//     	success: function(menuObject){
//             if(Object.entries(menuObject).length){
//                 var type = $(".type").val()
//                 var quantity = $(".quantity").val()
//     		    $(".registerCode").val(menuObject.registerCode);
//                 assignPrice(type, quantity, menuObject);
                
//             } else {
//     		    $(".registerCode").val("");
//                 $(".price").val("");
//             }
//         }
//     });