const redisClient = require("../redisClient");

const getTelefonosConUbicaciones = async () => {
    try {
        if (!redisClient.isOpen) await redisClient.connect();

        // Obtener todos los teléfonos (miembros) del sorted set 'ubicaciones'
        const telefonos = await redisClient.zRange("ubicaciones", 0, -1);
        
        if (telefonos.length === 0) {
            return [];
        }

        // Obtener las posiciones (latitud y longitud) de todos los teléfonos
        const posiciones = await redisClient.geoPos("ubicaciones", ...telefonos);
        redisClient.geoPos();

        // Combinar los IDs de los teléfonos con sus posiciones respectivas
        const resultados = telefonos.map((telefono, index) => ({
            id: telefono,
            lat: posiciones[index] ? posiciones[index][1] : null, // Latitud
            lng: posiciones[index] ? posiciones[index][0] : null  // Longitud
        }));

        //console.log(resultados);
        return resultados;
    } catch (error) {
        console.error("Error obteniendo teléfonos con ubicaciones:", error);
        return [];
    }
};

module.exports = { getTelefonosConUbicaciones };
