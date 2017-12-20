function TodoListViewModel(app, dataModel) {
    var self = this;

    // Data elements
    self.taskStatuses = {
        "Incomplete": 0,
        "Complete": 1
    };
    self.tasks = ko.observableArray([]);
    self.currentTask = ko.observable({ "name": "", "description": "" });
    self.taskDetails = ko.observable({ "name": "", "description": "" });

    // Visibility flags
    self.showEditor = ko.observable(false);
    self.showEditorActions = ko.observable(false);
    self.showAddTask = ko.observable(true);
    self.showNewTaskEditorActions = ko.observable(false);
    self.showTasks = ko.observable(true);
    self.showTaskDetails = ko.observable(false);

    // Filter flags
    self.showCompletedTasks = ko.observable(false);

    // Event handlers
    self.onAddTask = function () {
        self.openTaskEditor();
    };
    self.onNewTaskSave = function () {
        let task = self.currentTask();
        // propogate task to backend
        // TODO: extract to DAL layer
        var taskDto = {
            "name": task.name,
            "description": task.description
        }

        $.ajax({
            method: 'post',
            data: JSON.stringify(taskDto),
            url: app.dataModel.taskUrl,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (data) {
                // TODO: extract into a function
                // create full task object
                task = data;

                // add task to list
                self.tasks.push(task);

                // reset editor
                self.resetTaskEditor();
            }
        });
    }
    self.onNewTaskCancel = function () {
        self.resetTaskEditor();
    };
    self.onViewTask = function (task) {
        // set details to selected task
        self.taskDetails({ "name": task.name, "description": task.description });

        self.showTasks(false);
        self.showAddTask(false);

        self.showTaskDetails(true);


    };
    self.onCloseDetails = function () {
        self.showTaskDetails(false);

        // reset details
        self.taskDetails({ "name": "", "description": "" });

        self.showTasks(true);
        self.showAddTask(true);
    };
    self.onEditTask = function (task) {

        self.currentTask({ "id": task.id, "name": task.name, "description": task.description });
        self.openTaskEditor(task)
    };
    self.onSaveEditedTask = function () {
        let updatedTask = self.currentTask();

        // propogate task to backend
        // TODO: extract to DAL layer
        let taskDto = {
            "id": updatedTask.id,
            "name": updatedTask.name,
            "description": updatedTask.description
        }

        $.ajax({
            method: 'patch',
            data: JSON.stringify(taskDto),
            url: app.dataModel.updateTask,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (data) {
                // update task in the list
                let oldTask = ko.utils.arrayFirst(self.tasks(), function (task) {
                    return task.id == updatedTask.id;
                });
                self.tasks.replace(oldTask, updatedTask);

                // reset editor
                self.resetTaskEditor();
            }
        });
    };
    self.onTaskEditingCancel = function () {
        self.resetTaskEditor;
    };
    self.onCompleteTask = function (task) {

        task.status = self.taskStatuses.Complete;
        changeStatus(task);
    };
    self.onSetTaskIncomplete = function (task) {

        task.status = self.taskStatuses.Incomplete;
        changeStatus(task);
    };
    self.onDeleteTask = function (task) {
        let deletionConfirmationMsg = "Are you sure you want to delete task '" + task.name + "'?";

        if (confirm(deletionConfirmationMsg)) {
            let idToDelete = task.id;

            $.ajax({
                method: 'delete',
                data: JSON.stringify(idToDelete),
                url: app.dataModel.deleteTask,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                success: function (data) {
                    // remove task from todo list
                    self.tasks.remove(function (item) { return item.id == task.id; });

                }
            });
        }
    };

    self.showCompletedTasks.subscribe(function (checked) {
        // if show => fetch all tasks
        if (checked) {
            getTasks(true);
        }
        // otherwise fetch only incomplete
        else {
            getTasks(false);
        }
    });

    // UI Helpers
    self.openTaskEditor = function (task) {
        self.showEditor(true);
        self.showAddTask(false);
        if (task) {
            self.showEditorActions(true);
        }
        else {
            self.showNewTaskEditorActions(true);
        }
    }
    self.resetTaskEditor = function () {
        self.currentTask({ "name": "", "description": "" });
        self.showAddTask(true);
        self.showEditor(false);

        // hide all posible action groups
        self.showEditorActions(false);
        self.showNewTaskEditorActions(false);
    };

    // Data Access Helpers
    let getTasks = (includeCompleted) => {

        // Make a call to the protected Web API by passing in a Bearer Authorization Header
        $.ajax({
            method: 'get',
            url: app.dataModel.taskUrl + "?includeCompleted=" + includeCompleted,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (data) {
                // clear
                self.tasks.removeAll();
                // populate
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        let task = data[i];
                        self.tasks.push(task);
                    }
                }
            }
        });
    }
    let changeStatus = (updatedTask) => {
        $.ajax({
            method: 'patch',
            data: JSON.stringify(updatedTask),
            url: app.dataModel.changeStatus,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (data) {
                if (!self.showCompletedTasks() && updatedTask.status === self.taskStatuses.Complete) {
                    // remove task from todo list
                    self.tasks.remove(function (item) { return item.id == updatedTask.id; });
                }
                else {
                    // update task in the list
                    // Note: REPLACE as in Save Edit does not work here.. it does not refresh UI
                    // manual replacement does the trick though
                    var changedIdx = self.tasks.indexOf(updatedTask);
                    self.tasks.splice(changedIdx, 1); // removes the item from the array
                    self.tasks.splice(changedIdx, 0, updatedTask);
                }
            }
        });
    }
    // Routing
    Sammy(function () {
        this.get('#todo', function () {
            // By default only get incomplete tasks
            getTasks(false);
        });
        this.get('/', function () { this.app.runRoute('get', '#todo'); });
    });

    return self;
}

app.addViewModel({
    name: "ToDo",
    bindingMemberName: "todo",
    factory: TodoListViewModel
});
