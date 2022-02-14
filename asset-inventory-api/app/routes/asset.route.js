const middleware = require('../middlewares/auth.middleware');

module.exports = app => {
    const assets = require("../controllers/asset.controller.js");

    var router = require("express").Router();

    router.get("", middleware.authentication, assets.fetchAssets);

    router.get("/physicals/:id", middleware.authentication, assets.fetchSpecAsset);
    router.get("/networks/:id", middleware.authentication, assets.fetchSpecAsset);    
    router.get("/virtuals/:id", middleware.authentication, assets.fetchSpecAsset);

    router.get("/softwares", middleware.authentication, assets.fetchAssetSoftwares);
    router.get("/softwares/:id", middleware.authentication, assets.fetchSpecAssetSoftware);

    router.get("/hardwares", middleware.authentication, assets.fetchAssetGizmos);
    router.get("/hardwares/:id", middleware.authentication, assets.fetchSpecAssetGizmo);

    router.post("/add", middleware.authentication, assets.addAsset);
    router.post("/update/:id", middleware.authentication, assets.updateAsset);

    router.delete("/:asset_type/:id", middleware.authentication, assets.deleteSpecAsset);
    router.delete("/:asset_type", middleware.authentication, assets.deleteAssets);

    router.get("/approvals/list", middleware.authentication, assets.fetchAssetApprovals);
    router.post("/approvals/update", middleware.authentication, assets.updateAssetApprovals);

    app.use('/api/assets', router);
};