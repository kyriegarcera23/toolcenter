const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const roles = require("../controllers/role.controller.js");

    var router = require("express").Router();

    router.get("/", middleware.authentication, roles.fetchRoles);
    router.get("/:id", middleware.authentication, roles.fetchSpecRole);
    router.post('/add', middleware.authentication, roles.addRole);
    router.post("/update/:id", middleware.authentication, roles.updateRole);
    router.delete("/:id", middleware.authentication, roles.deleteRole);

    router.post("/role-permission/update", middleware.authentication, roles.updateRolePermission);

    app.use('/api/roles', router);
};