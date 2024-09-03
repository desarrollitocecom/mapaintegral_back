const { Router } = require("express");
const router = Router();
const { getCamarasMunicipalesHandler, getCamarasVecinalesHandler } = require("../handler/camarasHandler");

router.get("/municipales", getCamarasMunicipalesHandler);
router.get("/vecinales", getCamarasVecinalesHandler);

module.exports = router;
