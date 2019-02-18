function openMenu(){
    hideMainContainers();
    $("#show-menu").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
    $("#show-menu").off("click").on("click", showBackCurrentOrders);
    createMenuTemplate();
    menuLabels();
    sendRequest("/menu/show/all", {}, 
    (data) => { data.forEach( (item) => { setupMenuItem(item); }); });
}

function createMenuTemplate(){
    const ids = {
        menuContainer : "menu",
        navigationPanel : "menu-navigation",
        menuItemsContainer : "menu-container",
    };
    const   menu            = `<div id='${ids.menuContainer}' class='main-container'></div>`,
            navigationPanel = `<div id='${ids.navigationPanel}'></div>`,
            menuContainer   = `<div id='${ids.menuItemsContainer}'></div>`;
    $('body').  append(menu);
    $('#menu'). append([ navigationPanel, menuContainer ]);
}

function menuLabels(){
    const classes = {
        codeInput:  'menu-code',
        nameInput:  'menu-name',
        priceInput: 'menu-price',
    };
    const   createNewButton = '<button class="new-order-button" onclick="newMenuItem()"><i class="fas fa-folder-plus"></i> Dodaj pozycję</button>',
            codeInput       = `<input type='text' class='${classes.codeInput}'  value='Kod'         readonly>`,
            nameInput       = `<input type='text' class='${classes.nameInput}'  value='Nazwa'       readonly>`,
            price0Input     = `<input type='text' class='${classes.priceInput}' value='Sztuka'      readonly>`,
            price1Input     = `<input type='text' class='${classes.priceInput}' value='Gaiwan'      readonly>`,
            price2Input     = `<input type='text' class='${classes.priceInput}' value='Opakowanie'  readonly>`,
            price3Input     = `<input type='text' class='${classes.priceInput}' value='Na wagę'     readonly>`;
    $('#menu-navigation').append([codeInput, nameInput, price0Input, price1Input, price2Input, price3Input, 
                                createNewButton]);
}

function setupMenuItem(menuValues){
    const classes = {
        codeInput:      'menu-code',
        nameInput:      'menu-name',
        priceInput:     'menu-price',
        deleteButton:   'delete-button',
        updateButton:   'update-button',
        itemDiv:        'menu-item',
    };
    const   itemDiv         = `<div id='${menuValues._id}' class='${classes.itemDiv}'></div>`;
    const   deleteButton    = `<button class='${classes.deleteButton}' onclick="deleteMenuItem('${menuValues._id}')"><i class="fas fa-trash-alt"></i> Usuń</button>`,
            updateButton    = `<button class='${classes.updateButton}' onclick="updateMenuItem('${menuValues._id}')">Zapisz <i class="fas fa-pencil-alt"></i></button>`,
            codeInput       = `<input type='text'   class='${classes.codeInput}'                value='${menuValues.registerCode}'>`,
            nameInput       = `<input type='text'   class='${classes.nameInput}'                value='${menuValues.name}'>`,
            price0Input     = `<input type='text'   class='${classes.priceInput} menu-price0'   value='${menuValues.prices.default}'>`,
            price1Input     = `<input type='text'   class='${classes.priceInput} menu-price1'   value='${menuValues.prices.gaiwan}'>`,
            price2Input     = `<input type='text'   class='${classes.priceInput} menu-price2'   value='${menuValues.prices.package}'>`,
            price3Input     = `<input type='text'   class='${classes.priceInput} menu-price3'   value='${menuValues.prices.bulk}'>`;
    $('#menu-container').append(itemDiv);
    $(`#${menuValues._id}.menu-item`).append([
                deleteButton, 
                codeInput, nameInput, price0Input, price1Input, price2Input, price3Input, 
                updateButton]);
    if(Number(menuValues.registerCode))     { $(`#${menuValues._id}.menu-item`).css('order', menuValues.registerCode); } 
    else if(menuValues.registerCode == "")  { $(`#${menuValues._id}.menu-item`).css('order', 0); } 
    else                                    { $(`#${menuValues._id}.menu-item`).css('order', 100); }
}

function updateMenuItem(itemID){
    const newData = {
        name:           $(`#${itemID}.menu-item .menu-name`).val(),
        registerCode:   $(`#${itemID}.menu-item .menu-code`).val(),
        prices: {
            default:    $(`#${itemID}.menu-item .menu-price0`).val(),
            gaiwan:     $(`#${itemID}.menu-item .menu-price1`).val(),
            package:    $(`#${itemID}.menu-item .menu-price2`).val(),
            bulk:       $(`#${itemID}.menu-item .menu-price3`).val(),
        }
    };
    sendRequest("/menu/edit", {newData, _id: itemID}, (data) => { console.log("item edited"); });
}

function newMenuItem(){ sendRequest("/menu/new", {}, (data) => { setupMenuItem(data) }); }

function deleteMenuItem(itemID){ sendRequest("/menu/delete", {_id: itemID}, (data) => { $(`#${itemID}.menu-item`).remove(); }); }

function showBackCurrentOrders(){
    $('#record-view').show();
    $('#menu').remove();
    $('#show-menu').html(`<i class="fas fa-book-open"></i> Magazyn <i class="fas fa-book-open"></i>`);
    $('#show-menu').off("click").on("click", openMenu);
    showMainContainers();
}