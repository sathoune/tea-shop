/* global $ */
/* global sendRequest */
/* global header */

const tasks = {
    create: {
        open(){
            header.manageMainContainers.hideAll();
            $("#show-tasks").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
            $("#show-tasks").off("click").on("click", tasks.delete.close);
            tasks.create.container();
            tasks.update.day();
        }, 
        new(){
            const day = $(`#tasks-inputs select`).val();
            const task = $(`#tasks-inputs input`).val();
            sendRequest('/task/new', {day: day, task: task}, 
            (data) => {
                const taskHTML = tasks.html.task(data);
                $('#tasks-container').append(taskHTML.taskContainer);
                $(`#${data._id}`).append(taskHTML.values);
            });
        },
        container(){
            const templateHTML = tasks.html.containers();
            $('body').  append(templateHTML.tasks);
            $('#tasks'). append(templateHTML.containers);
            tasks.create.panel();
        },
        panel(){
            const html = tasks.html.panelControls();
            $('#tasks-navigation').append(html.containers);
            $('#tasks-labels').append(html.labels);
            $('#tasks-inputs').append(html.inputs);
            $('#day-of-the-week').on("click", tasks.update.day);
            $('#day-of-the-week').val(tasks.read.today());
        },
        taskReminder(){
            $(`#messages`).append(tasks.html.messageContainer);
            var millis = 30*60*1000;
            tasks.update.messages();
            if(millis){ var taskTimer = setInterval(tasks.update.messages, millis);
            } else { tasks.update.messages(); }
        },
        message(todos){
            const message = "<div>Pozostałe zadania na dziś:";
            var taskNames = "";
            todos.forEach(todo => taskNames += `<li>${todo.task}</li>`);
            $(`#tasks-message`).append(`${message} <ul>${taskNames}</ul> </div>${tasks.html.messageButton}`);
        },
    },
    
    read: {
        today(){
            var date = new Date().getDay();
            if(date == 0){ return "Sunday"; }
            else if(date == 1){ return "Monday"; }
            else if(date == 2){ return "Tuesday"; }
            else if(date == 3){ return "Wednesday"; }
            else if(date == 4){ return "Thursday"; }
            else if(date == 5){ return "Friday"; }
            else if(date == 6){ return "Saturday"; }
            else { return "this day is not a day"; }
        },
    },
    
    update: {
        task(taskId){
            console.log($(`#${taskId} .task-done`).is(":checked"));
            const newValues = {
                _id: taskId,
                day: $(`#${taskId} .task-day`).val(),
                task: $(`#${taskId} .task`).val(),
                done: $(`#${taskId} .task-done`).is(":checked"),
            };
            sendRequest("/task/update", newValues, (data) => {console.log(data); });
        },    
        day(){
            $('#tasks-container').html("");
            sendRequest("/task", {day: $('#day-of-the-week').val()}, 
            data => { 
                data.forEach(task => {
                    const taskHTML = tasks.html.task(task);
                    $('#tasks-container').append(taskHTML.taskContainer);
                    $(`#${task._id}`).append(taskHTML.values);
                    $(`#${task._id} select`).val(task.day);
                });
            });
        },
        messages(){
            $(`#tasks-message`).html("");
            sendRequest("/task/todo", {day: tasks.read.today()}, data => {
                if(data){ tasks.create.message(data); }
            });
        }
    },
    
    delete: {
        close(){
            $('#record-view').show();
            $('#tasks').remove();
            $('#show-tasks').html(`zadania`);
            $('#show-tasks').off("click").on("click", tasks.create.open);
            header.manageMainContainers.showAll();
        },   
        task(taskId){ sendRequest('/task/delete', {_id: taskId}, (data) => { $(`#${taskId}`).remove();  }); },
        message(){ $('#tasks-message').html(""); }
    },
        
    html: {
        messageContainer: `<div id="tasks-message"></div>`,
        messageButton: `<button style='width: 100%;' onclick='tasks.delete.message()'>Usuń wiadomość</button>`,
        selectDayLabel: `<input value="Zadania na:" readonly>`,
        selectDay: `<select id="day-of-the-week">
                        <option value="Monday">Poniedziałek</option>
                        <option value="Tuesday">Wtorek</option>
                        <option value="Wednesday">Środa</option>
                        <option value="Thursday">Czwartek</option>
                        <option value="Friday">Piątek</option>
                        <option value="Saturday">Sobota</option>
                        <option value="Sunday">Niedziela</option>
                    </select><br>`,
                    //brrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
                    //brrr
                    //brr
                    //brr
        containers(){
            const ids = {
                tasks  : "tasks",
                navigationPanel : "tasks-navigation",
                tasksContainer  : "tasks-container",
            };
            const   tasks            = `<div id='${ids.tasks}' class='main-container'></div>`,
                    navigationPanel  = `<div id='${ids.navigationPanel}'></div>`,
                    tasksContainer   = `<div id='${ids.tasksContainer}'></div>`;
            return {tasks, containers: [navigationPanel, tasksContainer]};
        },
        panelControls(){
            const   labelContainer  =   `<div id='tasks-labels'></div>`,
                    inputContainer  =   `<div id='tasks-inputs'></div>`;
            const   labelDay        =   `<input type='text' value='dzień'>`,
                    labelTask       =   `<input type='text' value='zadanie'>`;
            const   inputDay        =   `<select class="day">
                                            <option value="Monday">Poniedziałek</option>
                                            <option value="Tuesday">Wtorek</option>
                                            <option value="Wednesday">Środa</option>
                                            <option value="Thursday">Czwartek</option>
                                            <option value="Friday">Piątek</option>
                                            <option value="Saturday">Sobota</option>
                                            <option value="Sunday">Niedziela</option>
                                        </select>`,
                    inputTask       =   `<input type='text'>`,
                    saveButton      =   `<button onclick='tasks.create.new()'>Dodaj</button>`;
            return {containers: [inputContainer, labelContainer], 
            labels: [labelDay, labelTask], 
            inputs: [tasks.html.selectDayLabel, tasks.html.selectDay, inputDay, inputTask, saveButton]};
        },
        task(taskValues){
            let checked = "";
            if(taskValues.done){ checked = "checked"; } 
            const   taskContainer   = `<div id='${taskValues._id}'></div>`,
                    day             = `<select class="task-day">
                                            <option value="Monday">Poniedziałek</option>
                                            <option value="Tuesday">Wtorek</option>
                                            <option value="Wednesday">Środa</option>
                                            <option value="Thursday">Czwartek</option>
                                            <option value="Friday">Piątek</option>
                                            <option value="Saturday">Sobota</option>
                                            <option value="Sunday">Niedziela</option>
                                        </select>`,
                    text            = `<input class='task' type='text' value='${taskValues.task}'>`,
                    done            = `<label><input onclick='tasks.update.task("${taskValues._id}")' class='task-done' type='checkbox' ${checked}>zrobione!</label>`,
                    deleteButton    = `<button onclick='tasks.delete.task("${taskValues._id}")'>Usuń</button>`,
                    editButton      = `<button onclick='tasks.update.task("${taskValues._id}")'>Edytuj</button>`;
            return  {taskContainer: taskContainer, values: [deleteButton, editButton, day, text, done]};
        },
    },
};