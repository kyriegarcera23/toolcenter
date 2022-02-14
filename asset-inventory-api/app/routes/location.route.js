const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const locations = require("../controllers/location.controller.js");

    var router = require("express").Router();

    router.get("", locations.fetchLocations);
    router.get("/:id", locations.fetchSpecLocation);

    router.post("/add", locations.addLocation);
    router.post("/update/:id", locations.updateLocation);

    router.post("/delete", locations.deleteLocations);
    router.post("/delete/:id", locations.deleteSpecLocation);

    app.use('/api/assets/locations', router);
};