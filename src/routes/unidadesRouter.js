const { Router } = require("express");
const router = Router();
const { loginDolphin } = require("../handler/loginHandler");
const { getEstados } = require("../handler/estadosHandler");
const { getTiposUnidades } = require("../handler/tiposUnidadesHandler");
const { getRealTimeUnidadesHandler } = require("../handler/realTimeUnidadesHandler");

router.get("/login", loginDolphin);
router.get("/estados", getEstados);
router.get("/tiposunidades", getTiposUnidades);
router.post("/realtime", getRealTimeUnidadesHandler);


module.exports = router;
