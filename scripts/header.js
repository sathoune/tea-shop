function createHeader(){
    var showMenu = "<button id='show-menu'>Look at the menu</button>";
    var showArchive = "<button id='show-archive'>Look at the past</button>";
    var headerNavigation = [showMenu, showArchive];
    var nav = "<nav id='header'></nav>"
    $('body').prepend(nav);
    $('#header').append(headerNavigation);
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    
}