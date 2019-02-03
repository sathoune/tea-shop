function createHeader(){
    const   showMenu            = "<button id='show-menu' class='navigation-button'>Look at the menu</button>",
            showArchive         = "<button id='show-archive' class='navigation-button'>Look at the past</button>";
    const   headerNavigation    = [showMenu, showArchive];
    const   headerDiv           = "<div id='header'></div>"
    $('body').prepend(headerDiv);
    $('#header').append(headerNavigation);
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    
}