const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const report = require("../controllers/report.controller.js");

    var router = require("express").Router();

    router.post("/", middleware.authentication, report.fetchAssetReport);

    app.use('/api/assets/report', router);
};