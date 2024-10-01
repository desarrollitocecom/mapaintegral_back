const redisClient = require("../redisClient");
const { getIssiInfo, getPointInfo, addIssi, deleteIssiFromPoint } = require("../controllers/IssisController");

const addIssiHandler = async (req, res) => {

    const { issi, latitud, longitud, punto_index, feature_index, options } = req.body;
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
    if (typeof options !== "object" && Array.isArray(options))
        errors.push("no se detecto que options sea un objeto")
    //if (options.tipo === undefined && options.valor === undefined)
    // errors.push("no se detecto que options tenga propiedades figure o valor")
    if (errors.length > 0)
        return res.status(400).json({ error: errors.join(", ") });
    //console.log("options", options);
    try {
        const response = await addIssi(issi, latitud, longitud, punto_index, feature_index, options);
        if (response === 5)
            return res.status(201).json({ message: `${issi} agregada satisfactoriamente` });
        else if (response >= 0 && response < 4)
            return res.status(200).json({ message: `${issi} actualizada satisfactoriamente` });
        else
            return res.status(400).json({ message: `Error al agregar la ISSI ${issi}`, status: response });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error en addIssiHandler: ${error.message}` });
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

    const { latitud_api, longitud_api, punto_index_api, feature_index_api, options_api } = req.body;
    const errors = [];
    if (latitud_api === null || undefined)
        errors.push("no se detecto latitud");
    if (longitud_api === null || undefined)
        errors.push("no se detecto longitud");
    if (typeof options_api !== "object" && !Array.isArray(options_api))
        errors.push("options no es objecto o es un array, revisa el tipo de dato");
    if (errors.length > 0)
        return res.status(400).json({ error: errors.join(", ") });
    //console.log("options_api: ", options_api);
    try {
        if (!redisClient.isOpen)
            await redisClient.connect();
        const keys = await redisClient.keys("vigilancia:*");
        const issisMatched = [];
        for (const key of keys) {
            const issi = key.split(":")[1];
            const { latitud, longitud, punto_index, feature_index, options } = await redisClient.hGetAll(key);
            const options_formatted = JSON.parse(options);
            //console.log("options_formatted: ", options_formatted);
            //console.log("CONDICION: ", options_api.valor == options_formatted.valor);
            //console.log("API:", latitud, longitud, punto_index, feature_index);
            if (latitud && longitud) {
                if (latitud == latitud_api && longitud == longitud_api)
                    issisMatched.push(issi);
            } else {
                if (options_formatted.valor == options_api.valor)
                    issisMatched.push(issi);
            }
        }
        //console.log("cantidad: ", issisMatched.length);
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