function HomeViewModel(app, dataModel) {
    var self = this;

    self.myHometown = ko.observable("");

    Sammy(function () {
        this.get('#home', function () {
            // Make a call to the protected Web API by passing in a Bearer Authorization Header
            $.getJSON(app.dataModel.taskUrl, function (data) {
                let b = 5;
            }); 
               
        });
        this.get('/', function () { this.app.runRoute('get', '#home'); });
    });

    return self;
}

app.addViewModel({
    name: "Home",
    bindingMemberName: "home",
    factory: HomeViewModel
});
