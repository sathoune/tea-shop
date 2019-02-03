function openMenu(){
    $("#record-view").hide();
    $("#show-menu").html("back to orders");
    $("#show-menu").off("click").on("click", showBackCurrentOrders);
    createMenuTemplate();
    sendRequest("/menu/show/all", {}, 
    (data) => {
        menuLabels();
        data.forEach( (item) => {
            const div = createMenuItemDiv(item._id);
            $('#menu-container').append(div);
            setupMenuItem(item, div);
        });
    });
}

function createMenuItemDiv(menuId) {
    return  `<div id=${menuId} class='menu-item'></div>`;
}

function setupMenuItem(menuValues){
    const   deleteButton    = `<button onclick="deleteMenuItem('${menuValues._id}')">delete</button>`,
            codeInput       = `<input type='text' class='menu-code' value='${menuValues.registerCode}'>`,
            nameInput       = `<input type='text' class='menu-name' value='${menuValues.name}'>`,
            price0Input     = `<input type='text' class='menu-price0' value='${menuValues.prices.default}'>`,
            price1Input     = `<input type='text' class='menu-price1' value='${menuValues.prices.gaiwan}'>`,
            price2Input     = `<input type='text' class='menu-price2' value='${menuValues.prices.package}'>`,
            price3Input     = `<input type='text' class='menu-price3' value='${menuValues.prices.bulk}'>`,
            updateButton    = `<button class='update-button' onclick="updateMenuItem('${menuValues._id}')">update</button>`;
    const itemElements = [
        deleteButton, codeInput, nameInput, 
        price0Input, price1Input, price2Input, 
        price3Input, updateButton];
    $(`#${menuValues._id}.menu-item`).append(itemElements);
}

function createMenuTemplate(){
    const   menuDiv         = "<div id='menu'></div>";
    const   navigationPanel = "<div id='navigation'></div>",
            menuContainer   = "<div id='menu-container'></div>";
    const   menuContainers  = [ navigationPanel, menuContainer ]
    $('body').append(menuDiv);
    $('#menu').append(menuContainers);
}

function menuLabels(){
    const   createNewButton = '<button class="new-order-button" onclick="newMenuItem()">Add Position</button>',
            codeInput       = `<input type='text' class='menu-code' value='Code'>`,
            nameInput       = `<input type='text' class='menu-name' value='Name'>`,
            price0Input     = `<input type='text' class='menu-price' value='Default price'>`,
            price1Input     = `<input type='text' class='menu-price' value='Gaiwan price'>`,
            price2Input     = `<input type='text' class='menu-price' value='Package price'>`,
            price3Input     = `<input type='text' class='menu-price' value='Bulk price'>`;
    const    itemElements    = [
                codeInput, nameInput, price0Input, 
                price1Input, price2Input, price3Input, 
                createNewButton
                ];
    $('#navigation').append(itemElements);
}



function updateMenuItem(itemID){
    const newData = {
        name:  $(`#${itemID}.menu-item .menu-name`).val(),
        registerCode:  $(`#${itemID}.menu-item .menu-code`).val(),
        prices: {
            default: $(`#${itemID}.menu-item .menu-price0`).val(),
            gaiwan: $(`#${itemID}.menu-item .menu-price1`).val(),
            package: $(`#${itemID}.menu-item .menu-price2`).val(),
            bulk: $(`#${itemID}.menu-item .menu-price3`).val(),
        }
    };
    sendRequest("/menu/edit", {newData, _id: itemID}, (data) => { console.log("item edited"); });
}

function newMenuItem(){
    sendRequest("/menu/new", {}, 
    (data) => {
        const div = createMenuItemDiv(data._id);
        $('#menu-container').prepend(div);
        setupMenuItem(data)
    });
}

function deleteMenuItem(itemID){
    sendRequest("/menu/delete", {_id: itemID}, (data) => { $(`#${itemID}.menu-item`).remove(); });
}

function showBackCurrentOrders(){
    $('#record-view').show();
    $('#menu').remove();
    $('#show-menu').html("Look at the menu");
    $('#show-menu').off("click").on("click", openMenu);
}