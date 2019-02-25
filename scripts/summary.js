/* global $ */
/* global header */
/* global sendRequest */

const summary = {
    create: {
        open: () => {
            header.manageMainContainers.hideAll();
            $('body').append(summary.html.mainContainer);
            $('#summary').append([summary.html.navigationContainer, summary.html.resultsContainer]);
            $('#summary-navigation').append(summary.html.navigation);
            
        }, 
        sellingStats: () => {
            $('#summary-results').empty();
            $('#summary-results').append(summary.html.itemsContainer);
            if($('#summary-labels')){$('#summary-labels').remove() }
            const labels = summary.html.itemLabels();
            $('#summary-navigation').append(labels.container);
            $('#summary-labels').append(labels.inputs);
            $('#summary-labels .quantity').on('click', null, '.quantity', summary.update.orderBy);
            $('#summary-labels .income').on('click', null, '.income', summary.update.orderBy);
            let firstDay    = $('#day-start').val();
            let lastDay     = $('#day-end').val();
            sendRequest("/summary", {first: firstDay, last: lastDay}, (data) => {
                data.names.forEach((name, i) => {
                    const html = summary.html.itemContainer({id: data.id[i], name: name, quantity: data.count[i], income: data.income[i]});
                    $('#summary-items').append(html.container); 
                    $(`#${data.id[i]}`).append(html.inputs);
                    $(`#${data.id[i]}`).css('order', data.count[i]);
                });
            }); 
        },
        hourStats: () => {
            $('#summary-results').empty();
            $('#summary-results').append(summary.html.hoursContainer);
            if($('#summary-labels')){$('#summary-labels').remove() }
            const labels = summary.html.hourLabels();
            $('#summary-navigation').append(labels.container);
            $('#summary-labels').append(labels.inputs);
            let firstDay    = $('#day-start').val();
            let lastDay     = $('#day-end').val();
            sendRequest("/summary/hours", {first: firstDay, last: lastDay}, (data) => {
                    for(var key in data) {
                        const html = summary.html.hourContainer(key, data[key]);
                        $('#summary-hours').append(html.container);
                        $(`#${key}`).append(html.inputs);
                        
                    }
            });    
        },
    },
    update: {
        orderBy: (event) => {
            const items = $('.stats-item');
            for(var i=0; i<items.length; i++){
                let value = 100 * Number(($(`#${items[i].id} ${event.data}`).val()));
                $(items[i]).css('order', value.toFixed(0));
            }
        }
    },
    manage: {
        getDate: () => {
            const now = new Date();
            const date ={
                year: now.getFullYear(),
                month: (1 + now.getMonth()).toString().padStart(2, '0'),
                day: now.getDate().toString().padStart(2, '0'),
            };
            return `${date.year}-${date.month}-${date.day}`;
        },
    },
    
    html: {
        mainContainer:          `<div id='summary' class='main-container'></div>`,
        navigationContainer:    `<div id='summary-navigation'></div>`,
        resultsContainer:       `<div id='summary-results'></div>`,
        itemsContainer:         `<div id='summary-items'></div>`,
        hoursContainer:         `<div id='summary-hours'></div>`,
        navigation: () => {
            const   dateStartInput      = `<input id="day-start" type="date" name="trip-start" value='${summary.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    dateEndInput        = `<input id="day-end"   type="date" name="trip-start" value='${summary.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    sellingStatsButton  = `<button onclick='summary.create.sellingStats()'>przedmiociki</button>`,
                    hoursStatsButton    = `<button onclick='summary.create.hourStats()'>godzinki</button>`; 
            return [dateStartInput, dateEndInput, sellingStatsButton, hoursStatsButton];
        },
        itemContainer: (item) => {
            const   container       = `<div id='${item.id}' class='stats-item'</div>`;
            const   nameInput       = `<input class='name'     value='${item.name}' readonly>`,
                    quantityInput   = `<input class='quantity' value='${item.quantity}' readonly>`,
                    incomeInput     = `<input class='income'   value='${Number(item.income).toFixed(2)}' readonly>`;
            return {container: container, inputs: [nameInput, quantityInput, incomeInput]};
        },
        itemLabels: () => {
            const       container = `<div id='summary-labels'></div>`,
                        nameLabel       = `<input class='name'     value='Nazwa' readonly>`,
                        quantityLabel   = `<input class='quantity' value='Ilość' readonly>`,
                        incomeLabel     = `<input class='income'   value='Wpływ' readonly>`;
            return {container: container, inputs: [nameLabel, quantityLabel, incomeLabel]};
        },
        hourContainer: (hour, quantity) => {
            const   hourContainer = `<div id='${hour}' class='stats-item'></div>`,
                    hourInput = `<input type='text' value='${hour}:00' readonly>`,
                    quantityInput = `<input type='text' value ='${quantity}' readonly>`;
            return {container: hourContainer, inputs: [hourInput, quantityInput]};
        },
        hourLabels: () => {
            const   container = `<div id='summary-labels'></div>`,
                    hourLabel = `<input type='text' value='Godzina' readonly>`,
                    quantityLabel = `<input type='text' value ='Ilość zamówień' readonly>`;
                    
            return {container: container, inputs: [hourLabel, quantityLabel]};
        },
    },
};