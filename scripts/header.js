/* global $ */
/* global menu */
/* global item */
/* global order */
/* global strings */

promiseLanguage.then( () => {
    $(document).ready(() => {
        eventListeners.itemInputs();
        header.create();
        eventListeners.orderInputs();
        createNavigation();
        order.read.findOpen();
        tasks.create.taskReminder();
        reservations.create.reminder();
    });
});


const header = {
    create(){
        $('body').prepend(header.html.version, header.html.language, header.html.containers.main);
        $('#header').append( header.html.containers.messages, header.html.containers.buttons);
        $('#header-buttons').append(header.html.createButtons());
        
        $(`#language`).val(language);
        $("#show-menu").on("click", menu.create.open);
        $("#show-archive").on("click", archive.create.open);
        $("#show-tasks").on("click", tasks.create.open);
        $("#show-reservations").on("click", reservations.create.open);
        $("#language").on("change", changeLanguage);
    },
    manageMainContainers: {
        hideAll(){
            var mainContainers = $('.main-container');
            for(var i=0; i<mainContainers.length;i++){ $(mainContainers[i]).hide(); }
        },
        showAll(){
            var mainContainers = $('.main-container');
            for(var i=0; i<mainContainers.length;i++){ $(mainContainers[i]).show(); }
        },
    },
    
    html: {
        version: "<label id='version'>v.3 Chun-Mee</label>",
        language:   `<select id='language'>
                        <option value="english">english</option>
                        <option value="polish">polish</option>
                        <option value="czech">czech</option>
                    </select>`,
        containers: {
            main: "<div id='header' class='flex'></div>", 
            buttons: `<div id='header-buttons' class='flex-column'></div>`,
            messages: `<div id='messages' class='flex'></div>`,
        },
        createButtons(){
            const icons = {
                openBook: `<i class="fas fa-book-open"></i>`,
                box: `<i class="fas fa-archive"></i>`,
            };
            const   showMenu    = `<button id='show-menu' class='navigation-button'>${icons.openBook} ${strings.warehouse} ${icons.openBook}</button>`,
                    showArchive = `<button id='show-archive' class='navigation-button'>${icons.box} ${strings.archive} ${icons.box}</button>`,
                    showTasks   = `<button id='show-tasks' class='navigation-button'>Zadania</button>`,
                    showReservations = `<button id='show-reservations' class='navigation-button'>Rezerwacje</button>`;
                
            return [showReservations, showTasks, showMenu, showArchive];
        },
    },
};

const eventListeners = {
    itemInputs(){
        $('#record-view').on('change',  'div .name',                item.update.name);
        $('#record-view').on('change',  'div .type',                item.update.type);
        $('#record-view').on('change',  'div .quantity',            item.update.quantity);
        $('#record-view').on('keyup',   'div .quantity',            item.update.quantity);
        $('#record-view').on('keyup',   'div .price',               item.update.price);
        $('#record-view').on('keyup',   'div .discounted-price',    item.update.discountedPrice);
    },
    
    orderInputs(){
        $('#record-view').on('change',  '.discount',        order.update.discount);
        $('#record-view').on('keydown', '.discount',        order.update.discount);
        $('#record-view').on('change',  '.discount-to-go',  order.update.discountToGo);
        $('#record-view').on('change',  '.table',           order.update.table);
    },
};


function createNavigation(){
    const   topPanel = "<div id='top-panel'></div>",
            createOrder = `<button id='create-order' onclick='order.create.empty()'><i class="fas fa-folder-plus"></i> ${strings.newOrder}</button>`,
            orderDiv = "<div id='order-display' class='flex-column'></div>";
    $('#record-view').append([topPanel, orderDiv]);
    $('#top-panel').append(createOrder);
}
