/* global $ */
/* global menu */
/* global item */
/* global order */


$(document).ready(function(){
    eventListeners.itemInputs();
    header.create();
    eventListeners.orderInputs();
    createNavigation();
    order.read.findOpen();
    });

const header = {
    create: () => {
        const   version = "<label id='version'>v.3 Chun-Mee</label>";
        const   headerDiv           = "<div id='header'></div>";
        $('body').prepend(version, headerDiv);
        //$('body').prepend(version);
        $('#header').append(header.html.createButtons());
        $("#show-menu").on("click", menu.create.open);
        $("#show-archive").on("click", archive.create.open);
        //$("#show-tasks").on("click", openTasks);
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

const eventListeners = {
    itemInputs: () => {
        $('#record-view').on('change',  'div .name',                item.update.name);
        $('#record-view').on('change',  'div .type',                item.update.type);
        $('#record-view').on('change',  'div .quantity',            item.update.quantity);
        $('#record-view').on('keyup',   'div .quantity',            item.update.quantity);
        $('#record-view').on('keyup',   'div .price',               item.update.price);
        $('#record-view').on('keyup',   'div .discounted-price',    item.update.discountedPrice);
    },
    
    orderInputs: () => {
        $('#record-view').on('change',  '.discount',        order.update.discount);
        $('#record-view').on('keydown', '.discount',        order.update.discount);
        $('#record-view').on('change',  '.discount-to-go',  order.update.discountToGo);
        $('#record-view').on('change',  '.table',           order.update.table);
        
    },
};

function sendRequest(url, newData, callback){
    $.ajax(
    {
    	method: 'post',
    	url: url,
    	data: JSON.stringify(newData),
    	contentType: "application/json",
    	success: (data) => { callback(data); },
    });
}