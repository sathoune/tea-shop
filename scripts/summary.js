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
            let firstDay    = $('#day-start').val();
            let lastDay     = $('#day-end').val();

            sendRequest("/summary", {first: firstDay, last: lastDay}, (data) => {
                data.names.forEach((name, i) => {
                    const html = summary.html.itemContainer({id: data.id[i], name: name, quantity: data.count[i], income: data.income[i]});
                    if($(`#${data.id[i]}`)){
                        $(`#${data.id[i]}`).remove();
                    }
                    $('#summary-results').append(html.container); 
                    $(`#${data.id[i]}`).append(html.inputs);
                });
            }); 
        },
        hourStats: () => {
            let firstDay    = $('#day-start').val();
            let lastDay     = $('#day-end').val();

            sendRequest("/summary/hours", {first: firstDay, last: lastDay}, (data) => {
                    console.log(data);
                });    
        },
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
        navigation: () => {
            const   dateStartInput      = `<input id="day-start" type="date" name="trip-start" value='${summary.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    dateEndInput        = `<input id="day-end" type="date" name="trip-start" value='${summary.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    sellingStatsButton  = `<button onclick='summary.create.sellingStats()'>przedmiociki</button>`,
                    hoursStatsButton    = `<button onclick='summary.create.hourStats()'>godzinki</button>`; 
            return [dateStartInput, dateEndInput, sellingStatsButton, hoursStatsButton];
        },
        itemContainer: (item) => {
            const   container       = `<div id='${item.id}'</div>`;
            const   nameInput       = `<input class='name' value='${item.name}' readonly>`,
                    quantityInput   = `<input class='quantity' value='${item.quantity}'' readonly>`,
                    incomeInput     = `<input class='income' value='${Number(item.income).toFixed(2)}' readonly>`;
                    
            return {container: container, inputs: [nameInput, quantityInput, incomeInput]};
        },
    },
};