const { Router } = require("express");
const router = Router();
const unidadesRouter = require("../routes/unidadesRouter");
const camarasRouter = require("../routes/camarasRouter");
const radioRouter = require("../routes/radiosRouter");
const puntosTacticosRouter = require("../routes/puntosTacticosRouter");

//Prefijos para las rutas
router.use("/api", unidadesRouter);
router.use("/camaras", camarasRouter);
router.use("/radios", radioRouter);
router.use("/puntostacticos", puntosTacticosRouter);

module.exports = router;
