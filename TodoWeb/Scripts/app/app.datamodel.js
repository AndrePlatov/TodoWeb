function AppDataModel() {
    var self = this;
    // Routes
    self.userInfoUrl = "/api/Me";
    self.siteUrl = "/";
    self.taskUrl = "/api/Task";
    self.addTask = "/api/Task/Add";
    self.updateTask = "/api/Task/Update";
    self.changeStatus = "/api/Task/ChangeStatus";
    self.deleteTask = "/api/Task/Delete";

    // Route operations

    // Other private operations

    // Operations

    // Data
    self.returnUrl = self.siteUrl;

    // Data access operations
    self.setAccessToken = function (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
    };

    self.getAccessToken = function () {
        return sessionStorage.getItem("accessToken");
    };
}
