const redisClient = require("../redisClient");
const { getIssiInfo, getPointInfo, addIssi, deleteIssiFromPoint } = require("../controllers/IssisController");

const addIssiHandler = async (req, res) => {

    const { issi, latitud, longitud, punto_index, feature_index } = req.body;
    const errors = [];
    if (issi === null || undefined)
        errors.push("no se detecto issi");
    if (latitud === null || undefined)
        errors.push("no se detecto latitud");
    if (longitud === null || undefined)
        errors.push("no se detecto longitud");
    if (punto_index === null || undefined)
        errors.push("no se detecto punto_index");
    if (feature_index === null || undefined)
        errors.push("no se detecto feature_index");
    if (errors.length > 0)
        return res.status(400).json({ error: errors.join(", ") });

    try {
        const response = await addIssi(issi, latitud, longitud, punto_index, feature_index);
        if (response === 4)
            return res.status(201).json({ meesage: `${issi} agregada satisfactoriamente` });
        else if (response >= 0 && response < 4)
            return res.status(200).json({ meesage: `${issi} actualizada satisfactoriamente` });
        else
            return res.status(400).json({ message: `Error al agregar la ISSI ${issi}`, status: response });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error en addIssiHandler ${error.message}` });
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

const getPointInfoHandler = async (req, res) => {

    const { latitud_api, longitud_api, punto_index_api, feature_index_api } = req.body;
    const errors = [];
    if (latitud_api === null || undefined)
        errors.push("no se detecto latitud");
    if (longitud_api === null || undefined)
        errors.push("no se detecto longitud");
    if (errors.length > 0)
        return res.status(400).json({ error: errors.join(", ") });

    try {
        if (!redisClient.isOpen)
            await redisClient.connect();
        const keys = await redisClient.keys("vigilancia:*");
        const issisMatched = [];
        for (const key of keys) {
            const issi = key.split(":")[1];
            const { latitud, longitud, punto_index, feature_index } = await redisClient.hGetAll(key);
            //console.log("API:", latitud, longitud, punto_index, feature_index);
            if (punto_index == punto_index_api && feature_index == feature_index_api)
                issisMatched.push(issi);
        }

        if (issisMatched.length > 0)
            return res.status(200).json(issisMatched);
        else
            return res.status(204).json({});
    } catch (error) {
        console.error("Error verificando ISSIs por ubicación:", error);
        return res.status(500).json({ message: `Error verificando ISSIs por ubicación: ${error.message}` })
    }

};


const deleteIssiFromPointHandler = async (req, res) => {

    const { issi } = req.params;
    try {
        const result = await deleteIssiFromPoint(issi);

        if (result === null) {
            return res.status(404).json({ message: 'No se eliminó ninguna ISSI, posiblemente no existía.' });
        } else if (result === false) {
            return res.status(500).json({ message: 'Ocurrió un error al intentar eliminar la ISSI(s).' });
        } else {
            return res.status(200).json({ message: `Se eliminaron ${result} registros de ISSI(s).` });
        }

    } catch (error) {
        console.error('Error en deleteIssiFromPointHandler:', error);
        return res.status(500).json({ message: 'Error del servidor al intentar eliminar ISSI(s).' });
    }
};

module.exports = { addIssiHandler, getIssiInfoHandler, getPointInfoHandler, deleteIssiFromPointHandler }