const { Router } = require("express");
const router = Router();
const { getRadiosHandler, getRadioHandler, createRadioHandler, updateRadioHandler, deleteRadioHandler } = require("../handler/radiosHandler");

router.get("/", getRadiosHandler);
router.get("/:issi", getRadioHandler);
router.post("/", createRadioHandler);
router.put("/:issi", updateRadioHandler);
router.delete("/:issi", deleteRadioHandler);

module.exports = router;
