const { Router } = require("express");
const router = Router();
const { loginDolphin } = require("../handler/loginHandler");
const { getEstados } = require("../handler/estadosHandler");
const { getTiposUnidades } = require("../handler/tiposUnidadesHandler");
const { getRealTimeUnidadesHandler } = require("../handler/realTimeUnidadesHandler");
const { getUbicacionesCelulares } = require("../handler/ubicacionesCelHandler");

router.get("/login", loginDolphin);
router.get("/estados", getEstados);
router.get("/tiposunidades", getTiposUnidades);
router.get("/celrealtime", getUbicacionesCelulares);
router.post("/realtime", getRealTimeUnidadesHandler);



module.exports = router;
