/* global $ */
/* global header */
/* global sendRequest */

const summary = {
    create: {
        open: () => {
            header.manageMainContainers.hideAll();
            $('body').append(summary.html.mainContainer);
            sendRequest("/summary", {}, (data) => {
                data.names.forEach((name, i) => {
                   $('#summary').append(`<div style="background-color: white;">${name}     ilość zamówień: ${data.count[i]}    wpływ: ${data.income[i].toFixed(2)}</div>`); 
                });
            });
        }, 
        container: () => {
            
        },
    },
    
    html: {
        mainContainer: `<div id='summary' class='main-container'></div`,

    },
};