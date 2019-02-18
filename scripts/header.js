$(document).ready(function(){
    createListenersItemInputs();
    createHeader();
    createListenersOrderInputs();
    createNavigation();
    findOpenOrders();
    });


function createHeader(){
    const   showMenu            = `<button id='show-menu' class='navigation-button'>
    <i class="fas fa-book-open"></i> Magazyn <i class="fas fa-book-open"></i></button>`,
            showArchive         = `<button id='show-archive' class='navigation-button'>
            <i class="fas fa-archive"></i> Archiwum <i class="fas fa-archive"></i></button>`,
            version = "<label id='version'>v. anji-bai-cha</label>";
    const   headerNavigation    = [version, showMenu, showArchive];
    const   headerDiv           = "<div id='header'></div>";
    $('body').prepend(headerDiv);
    //$('body').prepend(version);
    $('#header').append(headerNavigation);
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    
}