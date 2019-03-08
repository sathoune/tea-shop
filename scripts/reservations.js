/* global $ */
/* global sendRequest */

const reservations = {
    create: {
        open(){
            header.manageMainContainers.hideAll();
            $("#show-reservations").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
            $("#show-reservations").off("click").on("click", reservations.delete.close);
            reservations.create.containers();
            sendRequest("/reservations", {}, 
            (data) => { 
                
            });
        },
        containers(){
            $('body').append(reservations.html.mainContainer);
            $('#reservations').append([reservations.html.controlsContainer, reservations.html.reservationsContainer]);
            $('#reservations-control').append(reservations.html.inputs());
            // document.querySelectorAll('input[type=number]')
            //   .forEach(e => e.oninput = () => {
            //     // Always 2 digits
            //     if (e.value.length >= 2) e.value = e.value.slice(0, 2);
            //     // 0 on the left (doesn't work on FF)
            //     if (e.value.length === 1) e.value = '0' + e.value;
            //     // Avoiding letters on FF
            //     if (!e.value) e.value = '00';
            //   });

        },
    },
    
    delete: {
        close(){
            $("#reservations").remove();
            header.manageMainContainers.showAll();
            $("#show-reservations").html(`Rezerwacje`);
            $('#show-reservations').off("click").on("click", reservations.create.open);
        },
    },
    
    html: {
        mainContainer: `<div id='reservations' class='main-container flex-column'></div>`,
        controlsContainer: `<div id='reservations-control' class='flex'></div>`,
        reservationsContainer: `<div id='reservation-container' class='flex'></div>`,
        hourOptions(){
            var hourOptions = "";
            for(var i=0; i<24; i++){
                if(i<10){ hourOptions += `<option value='${i}'>0${i}</option>`; } 
                else { hourOptions += `<option value='${i}'>${i}</option>`; }
            }
            return hourOptions;
        },
        minuteOptions(){
            var minuteOptions = "";
            for(var i=0; i<60; i+=5){
                if(i<10){ minuteOptions += `<option value='${i}'>0${i}</option>`; } 
                else { minuteOptions += `<option value='${i}'>${i}</option>`; }
            }
            return minuteOptions;
        },
        inputs(){
            const   dateInput = `<input id="reservation-day" type="date" value='${archive.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    hour = `<select name='hour'>${reservations.html.hourOptions()}</select>`,
                    minutes = `:<select name='minutes'>${reservations.html.minuteOptions()}</select>`,
                    name = `<input type='text' placeholder='kto'>`,
                    table = `<input type='text' placeholder='stolik'>`,
                    people = `<input type='number' placeholder='ile osób' min='0' max='100'>`,
                    hints = `<input type='text' placeholder='uwagi'>`,
                    save = `<button>Zapisz</button>`;
            
            
            return [dateInput, hour, minutes, name, table, people, hints, save];
        },
    },
};