function createHeader(){
    const   showMenu            = `<button id='show-menu' class='navigation-button'>
    <i class="fas fa-book-open"></i> Menu <i class="fas fa-book-open"></i></button>`,
            showArchive         = `<button id='show-archive' class='navigation-button'>
            <i class="fas fa-archive"></i> Archiwum X <i class="fas fa-archive"></i></button>`;
    const   headerNavigation    = [showMenu, showArchive];
    const   headerDiv           = "<div id='header'></div>";
    $('body').prepend(headerDiv);
    $('#header').append(headerNavigation);
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    
}