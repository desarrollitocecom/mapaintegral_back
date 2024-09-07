const redisClient = require("../redisClient");
const { getIssiInfo } = require("../controllers/IssisController");

const addIssiHandler = async (req, res) => {
    const { issi, latitude, longitude } = req.body;

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    try {
        const response = await redisClient.hSet(`vigilancia:${issi}`, {
            latitude: latitude,
            longitude: longitude
        });
        res.status(200).json({ issi, status: response });
    } catch (error) {
        res.status(500).json({ message: `"Error en "${error.message}` });
    }

};

const getIssiInfoHandler = async (req, res) => {

    const { id } = req.params;

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    try {
        
        const { point, position } = await getIssiInfo(id);
        errors = [];
        if (Object.keys(point).length === 0) {
            errors.push(`No se encontró punto para la ISSI: ${id}`);
        }
        if (Object.keys(position).length === 0) {
            errors.push(`No se encontró ubicacion para la ISSI: ${id}`);
        }
        if (errors.length > 0) {
            return res.status(404).json({ error: errors.join(", ") });
        }
        res.status(200).json({ point, position });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error en ${error}` })
    }

};

module.exports = { addIssiHandler, getIssiInfoHandler }