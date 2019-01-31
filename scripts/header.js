function createHeader(){
    var createOrder = "<button style='height: 2em;' onclick='createOrder()'>Create A Brand New Tasty Order</button>";
    var showMenu = "<button onclick='openMenu()'>Look at the menu</button>"
    var headerNavigation = [createOrder, showMenu]
    $('body').prepend(headerNavigation);
}