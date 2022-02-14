const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const areas = require("../controllers/area.controller.js");

    var router = require("express").Router();

    router.get("", areas.fetchAreas);
    router.get("/:id", areas.fetchSpecArea);

    router.post("/add", areas.addArea);
    router.post("/update/:id", areas.updateArea);

    router.post("/delete", areas.deleteAreas);
    router.post("/delete/:id", areas.deleteSpecArea);

    app.use('/api/advisories/areas', router);
};