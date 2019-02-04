function openMenu(){
    $("#record-view").hide();
    $("#show-menu").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
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
    const   deleteButton    = `<button class='delete-button' onclick="deleteMenuItem('${menuValues._id}')"><i class="fas fa-trash-alt"></i> Usuń</button>`,
            codeInput       = `<input type='text' class='menu-code' value='${menuValues.registerCode}'>`,
            nameInput       = `<input type='text' class='menu-name' value='${menuValues.name}'>`,
            price0Input     = `<input type='text' class='menu-price0' value='${menuValues.prices.default}'>`,
            price1Input     = `<input type='text' class='menu-price1' value='${menuValues.prices.gaiwan}'>`,
            price2Input     = `<input type='text' class='menu-price2' value='${menuValues.prices.package}'>`,
            price3Input     = `<input type='text' class='menu-price3' value='${menuValues.prices.bulk}'>`,
            updateButton    = `<button class='update-button' onclick="updateMenuItem('${menuValues._id}')">Zapisz <i class="fas fa-pencil-alt"></i></button>`;
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
    const   createNewButton = '<button class="new-order-button" onclick="newMenuItem()"><i class="fas fa-folder-plus"></i> Dodaj pozycję</button>',
            codeInput       = `<input type='text' class='menu-code' value='Kod'>`,
            nameInput       = `<input type='text' class='menu-name' value='Nazwa'>`,
            price0Input     = `<input type='text' class='menu-price' value='Sztuka'>`,
            price1Input     = `<input type='text' class='menu-price' value='Gaiwan'>`,
            price2Input     = `<input type='text' class='menu-price' value='Opakowanie'>`,
            price3Input     = `<input type='text' class='menu-price' value='Na wagę'>`;
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
    $('#show-menu').html(`<i class="fas fa-book-open"></i> Menu <i class="fas fa-book-open"></i>`);
    $('#show-menu').off("click").on("click", openMenu);
}