function createHeader(){
    var createOrder = "<button id='create-order' style='height: 2em;' onclick='createOrder()'>Create A Brand New Tasty Order</button>";
    var showMenu = "<button id='show-menu'>Look at the menu</button>";
    var showArchive = "<button id='show-archive'>Look at the past</button>";
    var headerNavigation = [createOrder, showMenu, showArchive];
    $('body').prepend(headerNavigation);
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    
}