function createHeader(){
    var createOrder = "<button id='create-order' style='height: 2em;' onclick='createOrder()'>Create A Brand New Tasty Order</button>";
    var showMenu = "<button id='show-menu'>Look at the menu</button>"
    var headerNavigation = [createOrder, showMenu]
    $('body').prepend(headerNavigation);
    $("#show-menu").on("click", openMenu);
    
}