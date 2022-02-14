const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.post("/register", users.register);
    router.post('/login', users.login);
    router.get("/profile", middleware.authentication, users.profile);
    router.get("/profile/model", users.profile);
    router.get("/logout", middleware.authentication, users.logout);
    
    router.get("/email-verification/:email", users.emailVerification);
    router.post("/change-password", users.changePassword);

    router.post("/reset-password", users.resetPassword);
    router.get("/reset-password/:email/:api_token", users.resetPasswordVerfication);
    router.get("", users.fetchUsers);
    router.get("/:id", users.fetchSpecUser);

    router.delete("/:id", middleware.authentication, users.deleteUser);

    router.post("/update/:id", middleware.authentication, users.updateUser);
    router.post("/user-role/update", middleware.authentication, users.updateUserRole);
    router.post("/user-permission/update", middleware.authentication, users.updateUserPermission);
    router.post("/user-client/update", middleware.authentication, users.updateUserClient);

    app.use('/api/users', router);
};