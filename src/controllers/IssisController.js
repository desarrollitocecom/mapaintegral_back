const redisClient = require("../redisClient");

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

const addIssi = async (issi, latitude, longitude) => {

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    try {
        const response = await redisClient.hSet(`vigilancia:${issi}`, {
            latitud: latitude,
            longitud: longitude
        });
        return response;
    } catch (error) {
        console.error(`"Error en addIssi: "${error.message}`);
        return false;
    }

}


module.exports = { getIssiInfo, addIssi };