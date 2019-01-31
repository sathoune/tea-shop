function openMenu(){
    console.log("opening menu...");
    $("#master").hide();
    sendDataToUpdate("/menu", {}, callback);
    function callback(data){
        data.forEach(function(item){
            var div = createItemDiv(item._id);
            $('body').append(div);
            setupMenuItem(item, div);
            console.log("done");
        })
    }
}

function createItemDiv(menuID) {
    return  `<div id=${menuID} class='menu-item'></div>`;

}

function setupMenuItem(menuValues){
    console.log(menuValues.name);
    var codeInput = `<input type='text' class='menu-code' value='${menuValues.registerCode}'>`;
    var nameInput = `<input type='text' class='menu-name' value='${menuValues.name}'>`;
    var price0Input = `<input type='text' class='menu-price' value='${menuValues.prices.default}'>`;
    var price1Input = `<input type='text' class='menu-price' value='${menuValues.prices.gaiwan}'>`;
    var price2Input = `<input type='text' class='menu-price' value='${menuValues.prices.package}'>`;
    var price3Input = `<input type='text' class='menu-price' value='${menuValues.prices.bulk}'>`;
    var itemElements = [codeInput, nameInput, price0Input, price1Input, price2Input, price3Input];
    
    $(`#${menuValues._id}`).append(itemElements);
}

