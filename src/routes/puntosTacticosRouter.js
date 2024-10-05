const { Router } = require("express");
const router = Router();
const { getPuntosTacticosHandler, getPuntoTacticoByIdHandler, createPuntoTacticoHandler, updatePuntoTacticoHandler, deletePuntoTacticoHandler } = require("../handler/puntosTacticosHandler");
const { getAllPuntosImportantesHandler, getPuntoImportanteByIdHandler } = require("../handler/puntosImportantesHandler");
const { getAllSubsectoresHandler, getSubsectorByIdHandler } = require("../handler/subsectorHandler");
const { getAllSectoresHandler, getSectorByIdHandler } = require("../handler/sectorHandler");


router.get("/importantes/", getAllPuntosImportantesHandler);
router.get("/importantes/:id", getPuntoImportanteByIdHandler);
router.get("/subsectores", getAllSubsectoresHandler);
router.get("/subsectores/:id", getSubsectorByIdHandler);
router.get("/sectores", getAllSectoresHandler);
router.get("/sectores/:id", getSectorByIdHandler);
router.get("/:id", getPuntoTacticoByIdHandler);
router.get("/", getPuntosTacticosHandler);
router.post("/", createPuntoTacticoHandler);
router.put("/:id", updatePuntoTacticoHandler);
router.delete("/:id", deletePuntoTacticoHandler);




module.exports = router;