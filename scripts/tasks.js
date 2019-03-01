/* global $ */
/* global sendRequest */
/* global header */
const tasks = {
    create: {
        open: () => {
            header.manageMainContainers.hideAll();
            $("#show-tasks").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
            $("#show-tasks").off("click").on("click", tasks.delete.close);
            tasks.create.container();
            sendRequest("/task", {}, 
            (data) => { 
                data.forEach(task => {
                    const taskHTML = tasks.html.task(task);
                    $('#tasks-container').append(taskHTML.taskContainer);
                    $(`#${task._id}`).append(taskHTML.values);
                });
            });
        }, 
        new: () => {
            const day = $(`#tasks-inputs select`).val();
            const task = $(`#tasks-inputs input`).val();
            sendRequest('/task/new', {day: day, task: task}, 
            (data) => {console.log(data)});
        },
        container: () => {
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
        },
    },
    
    delete: {
        close: () => {
            $('#record-view').show();
            $('#tasks').remove();
            $('#show-tasks').html(`zadania`);
            $('#show-tasks').off("click").on("click", tasks.create.open);
            header.manageMainContainers.showAll();
        },   
        task: (taskId) => {
            sendRequest('/task/delete', {_id: taskId}, (data) => {
               $(`#${taskId}`).remove(); 
            });
        }
        
    },
        
    html: {
        containers: () => {
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
        panelControls: () => {
            const   labelContainer  =   `<div id='tasks-labels'></div>`,
                    inputContainer  =   `<div id='tasks-inputs'></div>`;
            const   labelDay        =   `<input type='text' value='dzień'>`,
                    labelTask       =   `<input type='text' value='zadanie'>`;
            const   inputDay        =   `<select class="type">
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
            return {containers: [labelContainer, inputContainer], labels: [labelDay, labelTask], inputs: [inputDay, inputTask, saveButton]};
        },
        task: (taskValues) => {
            const   taskContainer   = `<div id='${taskValues._id}'></div>`,
                    text            = `<input type='text' value='${taskValues.task}'>`,
                    done            = `<label><input type='checkbox' value='${taskValues.done}'>zrobione!</label>`,
                    deleteButton    = `<button onclick='tasks.delete.task("${taskValues._id}")'>Usuń</button>`,
                    editButton      = `<button>Edytuj</button>`;
            return  {taskContainer: taskContainer, values: [deleteButton, editButton, text, done]};
        },
    },
};