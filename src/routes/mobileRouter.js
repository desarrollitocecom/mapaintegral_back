const { Router } = require("express");
const router = Router();
const { verifyPhotoMobileHandler, getUbicacionesHandler } = require('../handler/mobileHandler');
const { fotoMobileUpload } = require('../middlewares/uploadMiddleware');


router.post("/login", fotoMobileUpload, verifyPhotoMobileHandler);

router.get("/ubicaciones", getUbicacionesHandler);

module.exports = router;