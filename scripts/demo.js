// $ is defined in scope of view
function magicTrick(){
    
    $.ajax({
    	method: 'post',
    	url: '/data',
    	data: JSON.stringify({ name: $("#name").val() }),
    	contentType: "application/json",
    	success: function(data){
            console.log(data);
            if(Object.entries(data).length){
    		    $("#price").val(data.prices.default);
            }
        }
    });
}