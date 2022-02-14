const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const clients = require("../controllers/client.controller.js");

    var router = require("express").Router();

    router.get("", clients.fetchClients);
    router.get("/:id", clients.fetchSpecClient);

    router.post("/add", clients.addClient);
    router.post("/update/:id", clients.updateClient);

    router.post("/delete", clients.deleteClients);
    router.post("/delete/:id", clients.deleteSpecClient);

    app.use('/api/assets/clients', router);
};