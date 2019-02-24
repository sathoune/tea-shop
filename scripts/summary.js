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
                   $('#summary').append(`<div>${name}, ${data.count[i]}</div>`); 
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