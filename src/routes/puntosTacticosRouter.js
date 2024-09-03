const { Router } = require("express");
const router = Router();
const { getPuntosTacticosHandler, getPuntoTacticoByIdHandler, createPuntoTacticoHandler, updatePuntoTacticoHandler, deletePuntoTacticoHandler } = require("../handler/puntosTacticosHandler");

router.get("/:id", getPuntoTacticoByIdHandler);
router.get("/",getPuntosTacticosHandler);
router.post("/",createPuntoTacticoHandler);
router.put("/:id",updatePuntoTacticoHandler);
router.delete("/:id",deletePuntoTacticoHandler);

module.exports = router;
