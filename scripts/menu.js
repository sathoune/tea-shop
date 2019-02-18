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