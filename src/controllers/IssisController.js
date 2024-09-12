const redisClient = require("../redisClient");
const { deleteAlert } = require("../controllers/alertasController");

const getIssiInfo = async (id) => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        const point = await redisClient.hGetAll(`vigilancia:${id}`);
        const position = await redisClient.hGetAll(`unidades:${id}`);
        return { point, position };
    } catch (error) {
        console.error(`"Error en getIssiInfo: "${error.message}`);
        return null;
    }
}

const addIssi = async (issi, latitud, longitud, punto_index, feature_index) => {
    console.log("addIssi: ", issi, latitud, longitud, punto_index, feature_index);
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    try {
        const response = await redisClient.hSet(`vigilancia:${issi}`, {
            latitud: latitud,
            longitud: longitud,
            punto_index: punto_index,
            feature_index: feature_index
        });
        console.log("addIssi response: ", response);
        return response;
    } catch (error) {
        console.error(error);
        return false;
    }
}


const getPointInfo = async (latitud, longitud) => {

    try {
        if (!redisClient.isOpen)
            await redisClient.connect();
        const keys = await redisClient.keys("vigilancia:*");
        const issisMatched = [];
        for (const key of keys) {
            const issi = key.split(":")[1];
            const { latitude, longitude } = await redisClient.hGetAll(key);
            if (latitude == latitud && longitude == longitud)
                issisMatched.push(issi);
        }
        console.log("MATCH: ", issisMatched);
        if (issisMatched.length > 0)
            return issisMatched;
        else
            return null;
    } catch (error) {
        console.error("Error verificando ISSIs por ubicación:", error);
        return false;

    }

};

const deleteIssiFromPoint = async (issi, alertid) => {

    if (!redisClient.isOpen)
        await redisClient.connect();
    // Caso 1: Eliminar una ISSI específica si se proporciona
    if (issi) {
        if ((!/^\d+$/.test(issi))) {
            return null;
        }
        try {
            const response = await redisClient.del(`vigilancia:${issi}`);
            const reponse = await deleteAlert(issi);
            await redisClient.del(`vigilancia:${issi}`)
            //
            let alertsList = await redisClient.lRange("alerts", 0, -1);
            let alertsArray = alertsList.map(alert => JSON.parse(alert));
            const alertIdToRemove = issi;
            alertsArray = alertsArray.filter(alert => alert.issi !== alertIdToRemove);
            await redisClient.del("alerts");
            for (const alert of alertsArray) {
                alert.message = `ISSI ${issi} ha salido del área : ${pointInfo.nombre}`;
                await redisClient.rPush("alerts", JSON.stringify(alert));
            }
            //io.emit("alerta",alertsArray);
            return response > 0 ? response : null; // Retorna el número de eliminaciones o null si no se eliminó nada
        } catch (error) {
            console.error("Error al eliminar ISSI:", error);
            return false;
        }
    }
    // Caso 2: Eliminar todas las ISSIs si no se proporciona una ISSI específica
    else {
        console.log("llega:", issi);
        try {
            const keys = await redisClient.keys(`vigilancia:*`);
            if (keys.length > 0) {
                const response = await redisClient.del(keys);
                for (const key of keys) {
                    const issi = key.split(":")[1];
                    console.log(issi);
                    await deleteAlert(issi);
                    await redisClient.del(`vigilancia:${issi}`);
                }
                return response // Retorna el número de eliminaciones o null si no se eliminó nada
            } else
                return null; // Retorna null si no había claves que eliminar
        } catch (error) {
            console.error("Error al eliminar las ISSIs:", error);
            return false;
        }
    }
};



module.exports = { getIssiInfo, addIssi, getPointInfo, deleteIssiFromPoint };