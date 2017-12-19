function TodoListViewModel(app, dataModel) {
    var self = this;

    self.viewTask = function (task) {
        var b = 5;
    };
    self.editTask = function (task) {
        var b = 5;
    };
    self.completeTask = function (task) {
        var b = 5;
    };
    self.deleteTask = function (task) {
        var b = 5;
    };

    self.tasks = ko.observableArray([]);

    self.showEditor = ko.observable(false);
    self.currentTask;
    self.saveTask = function (task) {
        task = {
            "Name": "bb",
            "Description": "",
            "Status": 0,
            "view": self.viewTask
        };
        // add task to list
        //if (self.tasks.langth == 0) {
        //    self.tasks = ko.observableArray([task]);
        //}
        //else {
            self.tasks.push(task);
        //}
        // propogate task to backend
        // TODO: extract to DAL layer
            var taskDto = {
                "Name": task.Name,
                "Description": task.Description,
                "Status": 0 // TODO: replace with enum
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

                    self.showAddTask(true);
                    self.showEditor(false);
                }
            });
    }

    self.showAddTask = ko.observable(true);
    self.addTask = function () {
        self.showEditor(true);
        self.showAddTask(false);
    }.bind(self);

    Sammy(function () {
        this.get('#todo', function () {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.ajax({
                method: 'get',
                url: app.dataModel.taskUrl,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },                
                success: function (data) {
                    //self.tasks.push(data);
                    if (data) {
                        for (var i = 0; i < data.length; i++) {

                        }
                    }
                }
            });
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
