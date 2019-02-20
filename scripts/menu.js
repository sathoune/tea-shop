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
    const templateHTML = menuHTML.createMenuTemplate();
    $('body').  append(templateHTML.menu);
    $('#menu'). append(templateHTML.containers);
}

function menuLabels(){ $('#menu-navigation').append(menuHTML.createMenuLabels()); }

function setupMenuItem(menuValues){
    $('#menu-container').append(menuHTML.createMenuItemContainer(menuValues._id));
    $(`#${menuValues._id}.menu-item`).append(menuHTML.createMenuItem(menuValues));
    menuFunctions.orderMenuItemByRegisterCode(menuValues);
}

function updateMenuItem(itemId){
    const newData = menuFunctions.createMenuDbObject(itemId);
    sendRequest("/menu/edit", {newData, _id: itemId}, (data) => { console.log("item edited"); });
}

function newMenuItem(){ sendRequest("/menu/new", {}, (data) => { setupMenuItem(data) }); }

function deleteMenuItem(itemId){ sendRequest("/menu/delete", {_id: itemId}, (data) => { $(`#${itemId}.menu-item`).remove(); }); }

function showBackCurrentOrders(){
    $('#record-view').show();
    $('#menu').remove();
    $('#show-menu').html(`<i class="fas fa-book-open"></i> Magazyn <i class="fas fa-book-open"></i>`);
    $('#show-menu').off("click").on("click", openMenu);
    showMainContainers();
}


const menuFunctions = {
    createMenuDbObject: (itemId) => {
        return {
            name:           $(`#${itemId}.menu-item .menu-name`).val(),
            registerCode:   $(`#${itemId}.menu-item .menu-code`).val(),
            prices: {
                default:    $(`#${itemId}.menu-item .menu-price0`).val(),
                gaiwan:     $(`#${itemId}.menu-item .menu-price1`).val(),
                package:    $(`#${itemId}.menu-item .menu-price2`).val(),
                bulk:       $(`#${itemId}.menu-item .menu-price3`).val(),
            }
        };
    },
    
    orderMenuItemByRegisterCode: (menuValues) => {
        if(Number(menuValues.registerCode))     { $(`#${menuValues._id}.menu-item`).css('order', menuValues.registerCode); } 
        else if(menuValues.registerCode == "")  { $(`#${menuValues._id}.menu-item`).css('order', 0); } 
        else                                    { $(`#${menuValues._id}.menu-item`).css('order', 100); }
    },
};


const menuHTML = {
    createMenuTemplate: () => {
        const ids = {
            menuContainer : "menu",
            navigationPanel : "menu-navigation",
            menuItemsContainer : "menu-container",
        };
        const   menu            = `<div id='${ids.menuContainer}' class='main-container'></div>`,
                navigationPanel = `<div id='${ids.navigationPanel}'></div>`,
                menuContainer   = `<div id='${ids.menuItemsContainer}'></div>`;
        return {menu: menu, containers: [navigationPanel, menuContainer]};
    },
    
    createMenuLabels : () => {
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
        
        return [codeInput, nameInput, price0Input, price1Input, price2Input, price3Input, 
                            createNewButton];    
    },
    
    createMenuItemContainer: (itemId) => { return `<div id='${itemId}' class='menu-item'></div>`; },
    
    createMenuItem: (menuValues) => {
        const classes = {
            codeInput:      'menu-code',
            nameInput:      'menu-name',
            priceInput:     'menu-price',
            deleteButton:   'delete-button',
            updateButton:   'update-button',
            itemDiv:        'menu-item',
        };    
        const   deleteButton    = `<button class='${classes.deleteButton}' onclick="deleteMenuItem('${menuValues._id}')"><i class="fas fa-trash-alt"></i> Usuń</button>`,
                updateButton    = `<button class='${classes.updateButton}' onclick="updateMenuItem('${menuValues._id}')">Zapisz <i class="fas fa-pencil-alt"></i></button>`,
                codeInput       = `<input type='text'   class='${classes.codeInput}'                value='${menuValues.registerCode}'>`,
                nameInput       = `<input type='text'   class='${classes.nameInput}'                value='${menuValues.name}'>`,
                price0Input     = `<input type='text'   class='${classes.priceInput} menu-price0'   value='${menuValues.prices.default}'>`,
                price1Input     = `<input type='text'   class='${classes.priceInput} menu-price1'   value='${menuValues.prices.gaiwan}'>`,
                price2Input     = `<input type='text'   class='${classes.priceInput} menu-price2'   value='${menuValues.prices.package}'>`,
                price3Input     = `<input type='text'   class='${classes.priceInput} menu-price3'   value='${menuValues.prices.bulk}'>`;
                
        return [deleteButton, 
                codeInput, nameInput, price0Input, price1Input, price2Input, price3Input, 
                updateButton];
    },
};