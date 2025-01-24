const { Router } = require("express");
const router = Router();
const { addIssiHandler, getIssiInfoHandler, getPointInfoHandler, deleteIssiFromPointHandler } = require("../handler/issisHandler");


router.post("/add", addIssiHandler);
router.post("/area", getPointInfoHandler);
//router.get("/update", getPointInfoHandler);
router.delete("/delete/:issi?", deleteIssiFromPointHandler);
router.get("/show/:id", getIssiInfoHandler);


module.exports = router;