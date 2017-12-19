function TodoListViewModel(app, dataModel) {
    var self = this;

    self.tasks = ko.observable([]);

    Sammy(function () {
        this.get('#todo', function () {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.ajax({
                method: 'get',
                url: app.dataModel.taskUrl,
                contentType: "application/json; charset=utf-8",
                
                success: function (data) {
                    self.tasks(data);
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
