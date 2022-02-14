const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const sites = require("../controllers/site.controller.js");

    var router = require("express").Router();

    router.get("", sites.fetchSites);
    router.get("/:id", sites.fetchSpecSite);

    router.post("/add", sites.addSite);
    router.post("/update/:id", sites.updateSite);

    router.post("/delete", sites.deleteSites);
    router.post("/delete/:id", sites.deleteSpecSite);

    app.use('/api/advisories/sites', router);
};