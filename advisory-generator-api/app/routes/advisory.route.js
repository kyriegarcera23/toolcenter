const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const advisories = require("../controllers/advisory.controller.js");

    var router = require("express").Router();

    router.get("/list/:category", middleware.authentication, advisories.fetchAdvisories);
    router.get("/list/completed/:category", middleware.authentication, advisories.fetchCompletedAdvisories);
    router.get("/list/pending/:category", middleware.authentication, advisories.fetchPendingAdvisories);

    router.post("/add/initial", middleware.authentication, advisories.initialAdvisories);
    router.post("/add/completion", middleware.authentication, advisories.completeAdvisories);
    router.post("/add/cancellation", middleware.authentication, advisories.cancelAdvisories);
    router.post("/add/update/:batch_id", middleware.authentication, advisories.updateAdvisories);

    router.post("/approve", middleware.authentication, advisories.approveAdvisories);

    app.use('/api/advisories', router);
};