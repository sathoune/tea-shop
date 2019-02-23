function openTasks(){
    hideMainContainers();
    $("#show-tasks").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
    $("#show-tasks").off("click").on("click", closeTasks);
    createTaskContainer();
    
    sendRequest("/task", {}, 
    (data) => { 
        data.forEach(task => {
            const taskHTML = tasksHTML.showTask(task);
            console.log(taskHTML.values);
            $('#tasks-container').append(taskHTML.taskContainer);
            $(`#${task._id}`).append(taskHTML.values);
        });
    });
}

function closeTasks(){
    $('#record-view').show();
    $('#tasks').remove();
    $('#show-tasks').html(`zadania`);
    $('#show-tasks').off("click").on("click", openTasks);
    showMainContainers();
}

function createTaskContainer(){
    const templateHTML = tasksHTML.createTasksTemplate();
    $('body').  append(templateHTML.tasks);
    $('#tasks'). append(templateHTML.containers);
    createTaskPanel();
}

function createTaskPanel(){
    const html = tasksHTML.createTaskInput();
    $('#tasks-navigation').append(html.containers);
    $('#tasks-labels').append(html.labels);
    $('#tasks-inputs').append(html.inputs);
}

function createTask(){
    const day = $(`#tasks-inputs select`).val();
    const task = $(`#tasks-inputs input`).val();
    sendRequest('/task/new', {day: day, task: task}, 
    (data) => {console.log(data)});
}
       
const tasksHTML = {
    createTasksTemplate: () => {
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
    createTaskInput: () => {
        const   labelContainer  = `<div id='tasks-labels'></div>`,
                inputContainer  = `<div id='tasks-inputs'></div>`;
        const   labelDay        = `<input type='text' value='dzień'>`,
                labelTask       = `<input type='text' value='zadanie'>`;
        const   inputDay        =   `<select class="type">
                                        <option value="Monday">Poniedziałek</option>
                                        <option value="Tuesday">Wtorek</option>
                                        <option value="Wednesday">Środa</option>
                                        <option value="Thursday">Czwartek</option>
                                        <option value="Friday">Piątek</option>
                                        <option value="Saturday">Sobota</option>
                                        <option value="Sunday">Niedziela</option>
                                    </select>`,
                inputTask       = `<input type='text'>`,
                saveButton      = `<button onclick='createTask()'>Zapisz</button>`;
        return {containers: [labelContainer, inputContainer], labels: [labelDay, labelTask], inputs: [inputDay, inputTask, saveButton]};
    },
    showTask: (taskValues) => {
        const   taskContainer   = `<div id='${taskValues._id}'></div>`,
                text            = `<input type='text' value='${taskValues.task}'>`,
                done            = `<label><input type='checkbox' value='${taskValues.done}'>zrobione!</label>`,
                deleteButton    = `<button>Usuń</button>`,
                editButton      = `<button>Edytuj</button>`;
        return  {taskContainer: taskContainer, values: [deleteButton, editButton, text, done]};
    },
};