const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const permissions = require("../controllers/permission.controller.js");

    var router = require("express").Router();

    router.get("/", middleware.authentication, permissions.fetchPermissions);
    router.get("/:id", middleware.authentication, permissions.fetchSpecPermission);
    router.post('/add', middleware.authentication, permissions.addPermission);
    router.post("/update/:id", middleware.authentication, permissions.updatePermission);
    router.delete("/:id", middleware.authentication, permissions.deletePermission);

    app.use('/api/permissions', router);
};