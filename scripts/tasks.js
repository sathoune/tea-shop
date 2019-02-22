function openTasks(){
    hideMainContainers();
    $("#show-tasks").html(`<i class="fas fa-chevron-left"></i> Wróć do zamówień <i class="fas fa-chevron-left"></i>`);
    $("#show-tasks").off("click").on("click", closeTasks);
    createTaskContainer();
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
}

       
const tasksHTML = {
    createTasksTemplate: () => {
        const ids = {
            tasks  : "tasks",
            navigationPanel : "tasks-navigation",
            tasksContainer  : "tasks-container",
        };
        const   tasks            = `<div id='${ids.tasks}' class='main-container'></div>`,
                navigationPanel  = `<div id='${ids.navigationPanel}'>dadad</div>`,
                tasksContainer   = `<div id='${ids.tasksContainer}'>dsadad</div>`;
        return {tasks, containers: [navigationPanel, tasksContainer]};
    },
    xd : "xd",
};