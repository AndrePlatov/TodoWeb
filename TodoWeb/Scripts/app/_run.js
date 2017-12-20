$(function () {
    app.initialize();

    // Activate Knockout
    ko.validation.init({ grouping: { observable: false } });
    var options = {
        attribute: "data-bind",        // default "data-sbind"
        globals: window,               // default {}
        bindings: ko.bindingHandlers,  // default ko.bindingHandlers
        noVirtualElements: false       // default true
    };
    ko.bindingProvider.instance = new ko.secureBindingsProvider(options);

    ko.applyBindings(app);
});
