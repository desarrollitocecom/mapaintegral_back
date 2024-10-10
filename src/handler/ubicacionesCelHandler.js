
//const redisClient = require("../redisClient");
const { getUbicacionesCel } = require("../controllers/cellphoneController");


const getUbicacionesCelulares = async (req, res) => {
    try {
        const posiciones = await getUbicacionesCel();
        if (posiciones)
            return res.status(200).json({ posiciones });
        else
            return res.status(200).json({ posiciones:[] });
        // Emitir las posiciones resueltas a través de Socket.IO
        //console.log("posiciones emitidas:", posiciones);
    } catch (error) {
        console.error("Error obteniendo ubicaciones:", error);
        return [];
    }

};

module.exports = { getUbicacionesCelulares }