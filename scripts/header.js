/* global $ */
/* global menu */


$(document).ready(function(){
    createListenersItemInputs();
    header.create();
    createListenersOrderInputs();
    createNavigation();
    order.read.findOpen();
    });






const header = {
    create: () => {
        const   version = "<label id='version'>v.2 bai-hao</label>";
        const   headerDiv           = "<div id='header'></div>";
        $('body').prepend(version, headerDiv);
        //$('body').prepend(version);
        $('#header').append(header.html.createButtons());
        $("#show-menu").on("click", menu.create.open);
        $("#show-archive").on("click", archive.create.open);
        $("#show-tasks").on("click", openTasks);
    },
    manageMainContainers: {
        hideAll: () => {
            var mainContainers = $('.main-container');
            for(var i=0; i<mainContainers.length;i++){ $(mainContainers[i]).hide(); }
        },
        
        showAll: () => {
            var mainContainers = $('.main-container');
            for(var i=0; i<mainContainers.length;i++){ $(mainContainers[i]).show(); }
        },
    },
    
    html: {
        createButtons: () => {
        const icons = {
            openBook: `<i class="fas fa-book-open"></i>`,
            box: `<i class="fas fa-archive"></i>`,
        };
        const   showMenu    = `<button id='show-menu' class='navigation-button'>${icons.openBook} Magazyn ${icons.openBook}</button>`,
                showArchive = `<button id='show-archive' class='navigation-button'>${icons.box} Archiwum ${icons.box}</button>`,
                showTasks   = `<button id='show-tasks' class='navigation-button'>Zadania</button>`;
            
        return [showTasks, showMenu, showArchive];
        },
    },
};