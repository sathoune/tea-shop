function createHeader(){
    var showMenu = "<button id='show-menu' class='navigation-button'>Look at the menu</button>";
    var showArchive = "<button id='show-archive' class='navigation-button'>Look at the past</button>";
    var headerNavigation = [showMenu, showArchive];
    var headerDiv = "<div id='header'></div>"
    $('body').prepend(headerDiv);
    $('#header').append(headerNavigation);
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    
}