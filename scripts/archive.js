/* global $ */
/* global sendRequest */
/* global header */
/* global order */

const archive = {
    create: {
        open: () => {
            header.manageMainContainers.hideAll();
            $("#show-archive").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
            $("#show-archive").off("click").on("click", archive.delete.close);
            archive.create.containers();
            sendRequest("/archive/", {date: new Date()}, (data) => {
                var sum = 0;
                var discountedSum = 0;
                data.forEach((order) => {
                    if(order.closed){
                       if(order.sum){ sum+= Number(order.sum); } 
                       if(order.discountedSum){ discountedSum += Number(order.discountedSum); }
                       archive.create.orderContainer(order);   
                    }
                });
                archive.update.daySums(sum, discountedSum);
            });
        },
        containers: () => {
            const mainContainers = archive.html.containers();
            $('body').append(mainContainers.archiveContainer);
            $('#archive').append([mainContainers.archivePanel, mainContainers.archivedOrdersContainer]);
            const panelHTML = archive.html.panelControls();
            $('#archive-panel').append([panelHTML.panel.container, panelHTML.labels.container]);
            $(`#archived-orders-labels`).append(panelHTML.labels.labels);
            $(`#thingies`).append(panelHTML.panel.inputs);
            $(`#expand-all-button`).on("click", archive.manage.expandAllOrders);
            $('#day-for-display').on('change' , archive.update.day);
        },
        orderContainer: (orderData) => {
            const orderDiv = `<div id='${orderData._id}' class='archived-order'></div>`;
            $('#archived-orders').append(orderDiv);
            archive.create.orderDisplay(orderData);
        },
        orderDisplay: (orderData) => {
            const orderHTML = archive.html.order(orderData);
            $('#'+orderData._id).append(orderHTML.container);
            $(`#${orderData._id} .div-summary`).append(orderHTML.inputs);
            $(`#${orderData._id} .expand-button`).on("click", archive.manage.expandOrder);
        },
        itemDisplay(orderId, itemObject){
            const itemHTML = archive.html.item(itemObject);
            $(`#${orderId}.archived-order .item-container`).append(itemHTML.container);
            $(`#${itemObject._id}.item-div`).append(itemHTML.inputs);
        },
    },
    
    update: {
        day: () => {
            $('#archived-orders').empty();
                let dayForDisplay = $('#day-for-display').val();
                sendRequest('/archive', {date: dayForDisplay}, 
                (data) => {
                    if(data){
                        let sum = 0;
                        let discountedSum = 0;
                        data.forEach((item) => {
                           if(item.sum){ sum+= Number(item.sum); } 
                           if(item.discountedSum){ discountedSum += Number(item.discountedSum);}
                        });
                        data.forEach(archive.create.orderContainer); 
                        archive.update.daySums(sum, discountedSum);
                    } else {
                        archive.update.daySums(0,0);
                        console.log('this day is not a day');
                        //make message
                    }
                });
        },
        reopenOrder: (orderId) => {
            sendRequest('/archive/reopen', {_id: orderId}, (data) => { 
                $(`#${orderId}.archived-order`).remove(); 
                order.read.restore(data.order, data.tableProperties);
            });
        },
        daySums: (sum, discountedSum) => {
            $('#archive-panel #day-sum').val(Number(sum).toFixed(2));
            $('#archive-panel #discounted-day-sum').val(Number(discountedSum).toFixed(2));
        },
    },
    
    delete: {
        close: () => {
            if($('#summary')){ $('#summary').remove() }
            $('#record-view').show();
            $("#show-archive").html(`<i class="fas fa-archive"></i> Archiwum <i class="fas fa-archive"></i>`);
            $("#show-archive").off("click").on("click", archive.create.open);
            $('#archive').remove();
            header.manageMainContainers.showAll();
        }
    },
    
    manage: {
        expandOrder(){
            $(this).html(`${strings.collapseOrder} <i class="fas fa-search-minus"></i>`);
            $(this).off("click").on("click", archive.manage.collapseOrder);
            const orderID = $(this).parent().parent()[0].id;
            const itemContainer = `<div class='item-container'></div>`;
            const labelsHTML = archive.html.itemLabels();
            $(`#${orderID}.archived-order`).append([labelsHTML.container, itemContainer]);
            $(`#${orderID} .item-labels-container`).append(labelsHTML.labels);
            sendRequest("/archive/show-ordered-items", {_id: orderID}, 
            (data) => { 
                data.forEach( (item) => { archive.create.itemDisplay(orderID, item); }); 
                
            });
        },
        collapseOrder(){
            $(this).html(`${strings.expandOrder} <i class="fas fa-search-plus"></i>`);
            $(this).off("click").on("click", archive.manage.expandOrder);
            const orderId = $(this).parent().parent()[0].id;
            $(`#${orderId}.archived-order .item-container`).remove();
            $(`#${orderId}.archived-order .item-labels-container`).remove();
        },
        expandAllOrders(){
            var expandButtons = $('.archived-order .expand-button');
            for(var i=0; i<expandButtons.length; i++){
                $(expandButtons[i]).trigger("click");
            }
        },
        getDate(){
            const now = new Date();
            const date ={
                year: now.getFullYear(),
                month: (1 + now.getMonth()).toString().padStart(2, '0'),
                day: now.getDate().toString().padStart(2, '0'),
            };
            return `${date.year}-${date.month}-${date.day}`;
        },
    },
    
    html:  {
        containers: () => {
            const ids = {
                archiveContainer:          'archive',
                archivePanel:              'archive-panel',
                archivedOrdersContainer:   'archived-orders',
            };
            const   archiveContainer            = `<div id='${ids.archiveContainer}' class='main-container'></div`,
                    archivedOrdersContainer     = `<div id='${ids.archivedOrdersContainer}'></div>`,
                    archivePanel                = `<div id='${ids.archivePanel}'></div>`;
            return {archiveContainer: archiveContainer, archivedOrdersContainer: archivedOrdersContainer, archivePanel: archivePanel};
        },
        
        panelControls: () => {
            const   expandIcon = `<i class="fas fa-search-plus"></i>`;
            const   classes = {
                dateLabel: 'date-label',  
                daySum: 'day-sum',
            };
            const   expandAllButton     = `<button id='expand-all-button' class="expand-button">${strings.expandAll} ${expandIcon}</button>`;
            const   dateInput           = `<input                   id="day-for-display"    type="date" name="trip-start"   value='${archive.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    sumInput            = `<input class='${classes.daySum}'   id='day-sum'            type="number"                   value='0'           readonly>`,
                    discountedSumInput  = `<input class='${classes.daySum}'   id='discounted-day-sum' type="number"                   value='0'           readonly>`,
                    hourLabel           = `<input class='${classes.dateLabel}'                        type='text'                     value='${strings.opened}'     readonly>`,
                    tableLabel          = `<input class='${classes.dateLabel}'                        type='text'                     value='${strings.table}'      readonly>`,
                    sumLabel            = `<input class='${classes.dateLabel}'                        type='text'                     value='${strings.sum}'        readonly>`,
                    discountedSumLabel  = `<input class='${classes.dateLabel}'                        type='text'                     value='${strings.discountedSum}'   readonly>`,
                    advancedButton      = `<button onclick='summary.create.open()' class='navigation-button'>${strings.moreStatistics}</button>`,
                    dateLabel           = `<input type='text' class='${classes.dateLabel}' value='${strings.date}' readonly>`,
                    daySumLabel         = `<input type='text' class='${classes.dateLabel}' value='${strings.total}' readonly>`,
                    discountedDaySumLabel = `<input type='text' class='${classes.dateLabel}' value='${strings.discounted}' readonly>`;
            const   labelsContainer     = `<div id='archived-orders-labels' readonly></div>`;
            const   dayContainer = `<div id='thingies' class='thingies'></div>`;
            return {
                labels: {container: labelsContainer, labels: [advancedButton, hourLabel, tableLabel, sumLabel, discountedSumLabel, expandAllButton]},
                panel: {container: dayContainer, inputs: [dateLabel, dateInput, daySumLabel, sumInput, discountedDaySumLabel, discountedSumInput]},
            };
            
        
        },
        
        item: (itemObject) => {
            const   itemContainer       = `<div id='${itemObject._id}' class='item-div'></div>`,
                    nameInput           = `<input type="text" class="name" value='${itemObject.name}' readonly>`,
                    priceInput          = `<input class="price" type="number" value='${Number(itemObject.price).toFixed(2)}' readonly>`,
                    quantityInput       = `<input class="quantity" type="number" value='${itemObject.quantity}' readonly>`,
                    typeInput           = `<input class="type" type="text" value='${itemObject.type}' readonly>`,
                    discountedPriceInput= `<input class="discounted-price" type="number" value='${Number(itemObject.discountedPrice).toFixed(2)}' readonly>`;
        return {container: itemContainer, inputs: [nameInput, typeInput, quantityInput, priceInput, discountedPriceInput] };
        },
        
        itemLabels: () => {
            const   labelContainer = `<div class='item-labels-container'></div>`;
            const   nameLabel               = `<input type='text' class='name'      value='${strings.name}' readonly>`,
                    typeLabel               = `<input type='text' class='type'      value='${strings.type}' readonly>`,
                    quantityLabel           = `<input type='text' class='quantity'  value='${strings.quantity}' readonly>`,                  
                    priceLabel              = `<input type='text' class='price'     value='${strings.price}' readonly>`,
                    discoutnedPriceLabel    = `<input type='text' class='price'     value='${strings.discounted}' readonly>`;
            return {container: labelContainer, labels: [nameLabel, typeLabel, quantityLabel, priceLabel, discoutnedPriceLabel] };
        },
        
        order: (orderData) => {
            const   date = new Date(orderData.createdAt).getHours()+":"+new Date(orderData.createdAt).getMinutes()+":"+new Date(orderData.createdAt).getSeconds();
            const   summaryContainer      = `<div class='div-summary'></div>`;
            const   sendBackButton  = `<button class='send-back' onclick='archive.update.reopenOrder("${orderData._id}")'><i class="fas fa-long-arrow-alt-left"></i> ${strings.reopen}</button>`,
                    dateInput       = `<input type='text' class='order-date' value='${date}' readonly>`,
                    table           = `<input type='text' class='order-table' value='${orderData.table}' readonly>`,
                    sum             = `<input type='text' class='order-sum' value='${Number(orderData.sum).toFixed(2)}' readonly>`,
                    discountedSum   = `<input type='text' class='order-sum' value='${Number(orderData.discountedSum).toFixed(2)}' readonly>`,
                    expandButton    = `<button class="expand-button">${strings.expandOrder} <i class="fas fa-search-plus"></i></button>`;
            return {container: summaryContainer, inputs: [ sendBackButton, dateInput, table, sum, discountedSum, expandButton ]};
        },
    },
    
};