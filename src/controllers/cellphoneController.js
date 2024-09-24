const redisClient = require("../redisClient");

const getUbicacionesCel = () => {

    try {
        // Obtener los IDs de los teléfonos (miembros del sorted set)
        const telefonos = redisClient.zRange("ubicaciones", 0, -1);
        //console.log("telefono:", telefonos);

        if (telefonos.length === 0) {
            return [];
        }

        const fecha = new Date();

        // Usar Promise.all para resolver todas las promesas del map
        const posiciones = telefonos.map(async (telf, index) => {
            const posicion = redisClient.geoPos("ubicaciones", telf);
            //console.log(`index ${index} :`, posicion);
            // Aseguramos que posicion no sea null o undefined
            //if (posicion && posicion.latitude && posicion.longitude) 
            return {
                id: telf,
                position: posicion,
                date: fecha
            };

        });

        // Emitir las posiciones resueltas a través de Socket.IO
        io.emit("celpos", posiciones);
        console.log("posiciones emitidas:", posiciones);

        return posiciones;

    } catch (error) {
        console.error("Error obteniendo ubicaciones:", error);
        return [];
    }

};

module.exports = { getUbicacionesCel }