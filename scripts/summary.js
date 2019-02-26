/* global $ */
/* global header */
/* global sendRequest */

const summary = {
    create: {
        open: () => {
            header.manageMainContainers.hideAll();
            $('body').append(summary.html.mainContainer);
            $('#summary').append([summary.html.navigationContainer, summary.html.resultsContainer]);
            const navigation = summary.html.navigation();
            $('#summary-navigation').append(summary.html.panelContainer);
            $('#dates').append(navigation.dates);
            $('#buttons').append(navigation.buttons);
            
        }, 
        sellingStats: () => {
            $('#summary-results').empty();
            $('#summary-results').append(summary.html.itemsContainer);
            if($('#summary-labels')){$('#summary-labels').remove() }
            const labels = summary.html.itemLabels();
            $('#summary-navigation').append(labels.container);
            $('#summary-labels').append(labels.inputs);
            $('#summary-labels .all-count').on('click', null, '.all-count', summary.update.orderBy);
            $('#summary-labels .default-count').on('click', null, '.default-count', summary.update.orderBy);
            $('#summary-labels .gaiwan-count').on('click', null, '.gaiwan-count', summary.update.orderBy);
            $('#summary-labels .package-count').on('click', null, '.package-count', summary.update.orderBy);
            $('#summary-labels .bulk-count').on('click', null, '.bulk-count', summary.update.orderBy);
            $('#summary-labels .bulk-count-count').on('click', null, '.bulk-count-count', summary.update.orderBy);
            $('#summary-labels .income').on('click', null, '.income', summary.update.orderBy);
            let firstDay    = $('#day-start').val();
            let lastDay     = $('#day-end').val();
            sendRequest("/summary", {first: firstDay, last: lastDay}, (data) => {
                data.names.forEach((name, i) => {
                    const itemStats = {
                        id: data.id[i], 
                        name: name, 
                        quantity: {
                            all: data.quantity.all[i], 
                            default: data.quantity.default[i], 
                            gaiwan: data.quantity.gaiwan[i], 
                            package: data.quantity.package[i], 
                            bulkCount: data.quantity.bulkCount[i],
                            bulk: data.quantity.bulk[i],
                        },
                        income: data.income[i]
                    };
                    const html = summary.html.itemContainer(itemStats);
                    $('#summary-items').append(html.container); 
                    $(`#${data.id[i]}`).append(html.inputs);
                    $(`#${data.id[i]}`).css('order', data.quantity.all[i]);
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
                    
                    for(var i=0; i<data.hour.length; i++) {
                        const variables = { hour: data.hour[i], quantity: data.count[i], income: data.income[i] };
                        const html = summary.html.hourContainer(variables);
                        $('#summary-hours').append(html.container);
                        $(`#${variables.hour}`).append(html.inputs);
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
    
    delete: {
        close: () => {
            $('#summary').remove();
            $('#archive').css('display', 'block');
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
        panelContainer:         `<div id='summary-panel'><div id='dates'></div><div id='buttons'></div></div>`,
        resultsContainer:       `<div id='summary-results'></div>`,
        itemsContainer:         `<div id='summary-items'></div>`,
        hoursContainer:         `<div id='summary-hours'></div>`,
        navigation: () => {
            const   dateStartInput      = `<input id="day-start" type="date" name="trip-start" value='${summary.manage.getDate()}' min="2019-01-01" max="2025-12-31"><br>`,
                    dateEndInput        = `<input id="day-end"   type="date" name="trip-start" value='${summary.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    startLabel          = `<label>Od</label>`,
                    endLabel            = `<label>Do</label>`,
                    backButton          = `<button onclick='summary.delete.close()' class='navigation-button'>Wróć</button>`,
                    sellingStatsButton  = `<button onclick='summary.create.sellingStats()' class='update-button'>przedmiociki</button>`,
                    hoursStatsButton    = `<button onclick='summary.create.hourStats()' class='update-button'>godzinki</button>`; 
            return {dates: [startLabel, dateStartInput,  endLabel, dateEndInput], buttons:[ sellingStatsButton, hoursStatsButton, backButton]};
        },
        itemContainer: (item) => {
            const   container           = `<div id='${item.id}' class='stats-item'</div>`;
            const   nameInput           = `<input class='name'     value='${item.name}' readonly>`,
                    allCount            = `<input class='quantity all-count' value='${item.quantity.all}' readonly>`,
                    defaultCount        = `<input class='quantity default-count' value='${item.quantity.default}' readonly>`,
                    gaiwanCount         = `<input class='quantity gaiwan-count' value='${item.quantity.gaiwan}' readonly>`,
                    packageCount        = `<input class='quantity package-count' value='${item.quantity.package}' readonly>`,
                    bulkCount           = `<input class='quantity bulk-count' value='${item.quantity.bulk}' readonly>`,
                    bulkCountCount      = `<input class='quantity bulk-count-count' value='${item.quantity.bulkCount}' readonly>`,
                    incomeInput         = `<input class='quantity income'   value='${Number(item.income).toFixed(2)}' readonly>`;
            return {container: container, inputs: [nameInput, allCount, defaultCount, gaiwanCount, packageCount, bulkCount, bulkCountCount, incomeInput]};
        },
        itemLabels: () => {
            const       container = `<div id='summary-labels'></div>`,
                        nameLabel       = `<input class='name'     value='Nazwa' readonly>`,
                    allCount            = `<input class='quantity all-count' value='Suma' readonly>`,
                    defaultCount        = `<input class='quantity default-count' value='Sztuka' readonly>`,
                    gaiwanCount         = `<input class='quantity gaiwan-count' value='Gaiwan' readonly>`,
                    packageCount        = `<input class='quantity package-count' value='Opakowanie' readonly>`,
                    bulkCount           = `<input class='quantity bulk-count' value='Na wagę' readonly>`,
                    bulkCountCount      = `<input class='quantity bulk-count-count' value='Zakupy' readonly>`,
                        incomeLabel     = `<input class='quantity income'   value='Wpływ' readonly>`;
            return {container: container, inputs: [nameLabel, allCount, defaultCount, gaiwanCount, packageCount, bulkCount, bulkCountCount, incomeLabel]};
        },
        hourContainer: (values) => {
            const   hourContainer = `<div id='${values.hour}' class='stats-item'></div>`,
                    hourInput = `<input type='text' value='${values.hour}:00' readonly>`,
                    incomeInput = `<input type='text' value='${values.income}' readonly>`,
                    quantityInput = `<input type='text' value ='${values.quantity}' readonly>`;
            return {container: hourContainer, inputs: [hourInput, quantityInput, incomeInput]};
        },
        hourLabels: () => {
            const   container = `<div id='summary-labels'></div>`,
                    hourLabel = `<input type='text' value='Godzina' readonly>`,
                    incomeLabel = `<input type='text' value='Wpływ' readonly>`,
                    quantityLabel = `<input type='text' value ='Ilość zamówień' readonly>`;
                    
            return {container: container, inputs: [hourLabel, quantityLabel, incomeLabel]};
        },
    },
};