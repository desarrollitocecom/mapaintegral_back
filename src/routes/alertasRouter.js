const { Router } = require("express");
const router = Router();
const { getAlertHandler, getAlertsHandler, createAlertHandler, closeAlertHandler } = require("../handler/alertasHandler");

router.get("/:id", getAlertHandler);
router.get("/issi/:issi", getAlertsHandler);
router.post("/",createAlertHandler);
router.put("/:id", closeAlertHandler);
//router.delete("/:id", deletePuntoTacticoHandler);

module.exports = router;
