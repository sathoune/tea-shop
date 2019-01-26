// $ is defined in scope of view
$(document).ready(function(){
    $("#name").change(function(){
       magicTrick(); 
    });
});

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