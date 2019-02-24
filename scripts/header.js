$(document).ready(function(){
    createListenersItemInputs();
    createHeader();
    createListenersOrderInputs();
    createNavigation();
    order.read.findOpen();
    });


function createHeader(){
    
    const   version = "<label id='version'>v.2 bai-hao</label>";
    const   headerDiv           = "<div id='header'></div>";
    $('body').prepend(version, headerDiv);
    //$('body').prepend(version);
    $('#header').append(headerHTML.createButtons());
    $("#show-menu").on("click", openMenu);
    $("#show-archive").on("click", openArchive);
    $("#show-tasks").on("click", openTasks);
    
}

const headerHTML = {
    createButtons: () => {
        const icons = {
            openBook: `<i class="fas fa-book-open"></i>`,
            box: `<i class="fas fa-archive"></i>`,
        };
        const   showMenu    = `<button id='show-menu' class='navigation-button'>${icons.openBook} Magazyn ${icons.openBook}</button>`,
                showArchive = `<button id='show-archive' class='navigation-button'>${icons.box} Archiwum ${icons.box}</button>`,
                showTasks   = `<button id='show-tasks' class='navigation-button'>Zadania</button>`;
            
        return [showTasks, showMenu, showArchive];
    }
}