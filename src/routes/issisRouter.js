const { Router } = require("express");
const router = Router();
const { addIssiHandler, getIssiInfoHandler } = require("../handler/issisHandler");


router.post("/add", addIssiHandler);
router.get("/update",);
router.get("/delete", async (req, res) => res.status(200).json({ msg: "Delete" }));
router.get("/show/:id", getIssiInfoHandler);
router.get("/area/:id", async (req, res) => res.status(200).json({ msg: req.params.id }));


module.exports = router;

/* 
const { issi, latitude, longitude } = req.body;

    try {
        const response = await redisClient.hSet(`vigilancia:${issi}`, {
            latitude: latitude,
            longitude: longitude
        });
        res.status(200).json({ msg: response })
    } catch (error) {
        res.status(500).json({ message: `"Error en "${error.message}` })
    }
*/
