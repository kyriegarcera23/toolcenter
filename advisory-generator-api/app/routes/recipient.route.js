const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const recipients = require("../controllers/recipient.controller.js");

    var router = require("express").Router();

    router.get("", recipients.fetchRecipients);
    router.get("/:id", recipients.fetchSpecRecipient);

    router.post("/add", recipients.addRecipient);
    router.post("/update/:id", recipients.updateRecipient);

    router.post("/delete", recipients.deleteRecipients);
    router.post("/delete/:id", recipients.deleteSpecRecipient);

    app.use('/api/advisories/recipients', router);
};