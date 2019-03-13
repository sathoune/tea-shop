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
            (foundReservations) => { 
                foundReservations.forEach( reservation => {
                    const html = reservations.html.display(reservation);
                    $(`#reservation-container`).append(html.container);
                    $(`#${reservation._id}`).append(html.inputs);
                });
            });
        },
        containers(){
            $('body').append(reservations.html.mainContainer);
            $('#reservations').append([reservations.html.controlsContainer, reservations.html.reservationsContainer]);
            const html = reservations.html.inputs();
            const html2 = reservations.html.controls();
            $('#reservations-control').append(html.container);
            $('#reservations-control').append(html2.container);
            $('#new-reservation').append(html.inputs);
            $('#reservation-day-choice').append(html2.inputs);
            
        },
        reservation(){
            const reservationData = {
                day: $(`#reservation-day`).val(),
                hour: $(`#reservation-hour`).val(),
                minutes: $(`#reservation-minutes`).val(),
                name: $(`#reservation-name`).val(),
                table: $(`#reservation-table`).val(),
                hints: $(`#reservation-hints`).val(),
                people: $(`#reservation-people`).val(),
                waterPipe: $(`#reservation-pipe`).is(":checked"),
            };
            sendRequest("/reservations/new", reservationData, (data) => {
               console.log(data); 
            });
        },
    },
    update: {
        reservation(id){
            const reservationData = {
                id: id,
                day: $(`#reservation-day`).val(),
                hour: $(`#${id} .reservation-hour`).val(),
                minutes: $(`#${id} .reservation-minutes`).val(),
                name: $(`#${id} .reservation-name`).val(),
                table: $(`#${id} .reservation-table`).val(),
                hints: $(`#${id} .reservation-hints`).val(),
                people: $(`#${id} .reservation-people`).val(),
                waterPipe: $(`#${id} .reservation-pipe`).is(":checked"),
            };
            sendRequest("reservations/update", reservationData, (beta) => {
                console.log(beta);
            });
        }
    },
    delete: {
        close(){
            $("#reservations").remove();
            header.manageMainContainers.showAll();
            $("#show-reservations").html(`Rezerwacje`);
            $('#show-reservations').off("click").on("click", reservations.create.open);
        },
        reservation(id){
            sendRequest("/reservations/delete", {_id: id}, (beta) => {
                $(`#${id}`).remove();
            });
        }
    },
    
    html: {
        mainContainer: `<div id='reservations' class='main-container flex-column'></div>`,
        controlsContainer: `<div id='reservations-control'></div>`,
        reservationsContainer: `<div id='reservation-container' class='flex-column'></div>`,
        hourOptions(hour = '14'){
            var hourOptions = "";
            for(let i=0; i<24; i++){
                let selected = "";
                if(i == Number(hour)){ selected = "selected"; }
                if(i<10){ hourOptions += `<option value='0${i}' ${selected}>0${i}</option>`; } 
                else { hourOptions += `<option value='${i}' ${selected}>${i}</option>`; }
            }
            return hourOptions;
        },
        minuteOptions(minutes = "0"){
            var minuteOptions = "";
            for(let i=0; i<60; i+=5){
                let selected = "";
                if(i == Number(minutes)){ selected= "selected"; }
                if(i<10){ minuteOptions += `<option value='0${i}' ${selected}>0${i}</option>`; } 
                else { minuteOptions += `<option value='${i}' ${selected}>${i}</option>`; }
            }
            return minuteOptions;
        },
        controls(){
            const   controlsContainer = `<div id='reservation-day-choice'></div>`; //???????????
            const   day = `<input id="show-day" type="date" value='${archive.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    dayLabel = `<label>Wyświetl z dnia: </label>`;
                    return {container: controlsContainer, inputs: [dayLabel, day]};
        },
        inputs(){
            const   newReservationContainer = `<div id="new-reservation"></div>`;
            const   dateInput = `<input id="reservation-day" class='reservation-day' type="date" value='${archive.manage.getDate()}' min="2019-01-01" max="2025-12-31">`,
                    hour = `<select id='reservation-hour' class='reservation-hour' name='hour'>${reservations.html.hourOptions()}</select>`,
                    minutes = `:<select id='reservation-minutes' class='reservation-minutes' name='minutes'>${reservations.html.minuteOptions()}</select>`,
                    name = `<input id='reservation-name' class='reservation-name' type='text' placeholder='kto'>`,
                    table = `<input id='reservation-table' class='reservation-table' type='text' placeholder='stolik'>`,
                    people = `<input id='reservation-people' class='reservation-people' type='number' placeholder='ile' min='0' max='100'>`,
                    hints = `<input id='reservation-hints' class='reservation-hints' type='text' placeholder='uwagi'>`,
                    waterPipe = `<label>fajka wodna<input type='checkbox' id='reservation-pipe'></label>`,
                    save = `<button onclick='reservations.create.reservation()' id='reservation-save' class='reservation-save'>Zapisz</button>`;
            
            return {container: newReservationContainer, inputs: [dateInput, hour, minutes, table, name, people, waterPipe, hints, save] };
        },
        display(reservationData){
            let waterPipeChecked = "";
            let handledChecked = "";
            if(reservationData.waterPipe == 'true'){ 
                waterPipeChecked = "checked" ; }
            if(reservationData.done == 'true'){ 
                handledChecked = "checked" ; }
            const   container = `<div id='${reservationData._id}'></div>`;
            const   hour = `<select class='reservation-hour' name='hour'>${reservations.html.hourOptions(new Date(reservationData.date).getHours()-1)}</select>`,
                    minutes = `:<select class='reservation-minutes' name='minutes'>${reservations.html.minuteOptions(new Date(reservationData.date).getMinutes())}</select>`,
                    name = `<input class='reservation-name' type='text' value='${reservationData.name}'>`,
                    table = `<input class='reservation-table' type='text' value='${reservationData.table}'>`,
                    people = `<input class='reservation-people' type='number' value='${reservationData.people}'' min='0' max='100'>`,
                    hints = `<input class='reservation-hints' type='text' value='${reservationData.hints}'>`,
                    waterPipe = `<label>fajka wodna<input type='checkbox' id='reservation-pipe' ${waterPipeChecked}></label>`,
                    handled = `<label>gotowe<input type='checkbox' id='reservation-pipe' ${handledChecked}></label>`,
                    editButton =`<button onclick='reservations.update.reservation("${reservationData._id}")' class='reservation-update'>Edytuj</button>`,
                    deleteButton = `<button onclick='reservations.delete.reservation("${reservationData._id}")' class='reservation-delete'>Usuń</button>`;
                    
                return {container: container, inputs: [deleteButton, hour, minutes, table, name, people, waterPipe, hints, handled, editButton]};
        },
    },
};