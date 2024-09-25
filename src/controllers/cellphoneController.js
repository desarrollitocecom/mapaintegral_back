const redisClient = require("../redisClient");
const { getUser } = require("../controllers/usuariosController");

const getUbicacionesCel = async () => {

    if (!redisClient.isOpen)
        await redisClient.connect();
    
    try {
        // Obtener los IDs de los teléfonos (miembros del sorted set)
        const telefonos = await redisClient.zRange("ubicaciones", 0, -1);
        //console.log("telefono:", telefonos);
        if (telefonos.length === 0) {
            return [];
        }
        
        // Usar Promise.all para resolver todas las promesas del map
        const posiciones = await Promise.all(
            telefonos.map(async (telf, index) => {
                const posicion = await redisClient.geoPos("ubicaciones", telf);
                const date = await redisClient.hGetAll(`ubicacion:${telf}`);
                const { dataValues } = await getUser(telf);
                const { TurnoAsociado: { nombre } } = dataValues;
                return {
                    id: telf,
                    position: posicion,
                    date: date.timestamp,
                    nombres: dataValues.nombres,
                    apellidos: dataValues.apellidos,
                    telefono: dataValues.telefono,
                    dni: dataValues.dni,
                    turno: nombre,
                    superior: dataValues.superior,
                };
            })
        );
        // Emitir las posiciones resueltas a través de Socket.IO
        //io.emit("celpos", posiciones);
        //console.log("posiciones emitidas:", posiciones);
        return posiciones;
    } catch (error) {
        console.error("Error obteniendo ubicaciones:", error);
        return null;
    }

};

module.exports = { getUbicacionesCel }