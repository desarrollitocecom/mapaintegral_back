const redisClient = require("../redisClient");
const { io } = require("../server");
const { getUser } = require("../controllers/usuariosController");

const getUbicaciones = async () => {
    try {
        // Obtener los IDs de los teléfonos (miembros del sorted set)
        const telefonos = await redisClient.zRange("ubicaciones", 0, -1);
        if (telefonos.length === 0) {
            return [];
        }
        // Usar Promise.all para resolver todas las promesas del map
        const posiciones = await Promise.all(
            telefonos.map(async (telf) => {
                const posicion = await redisClient.geoPos("ubicaciones", telf);
                const date = await redisClient.hGetAll(`ubicacion:${telf}`);
                const response = await getUser(telf);
                // Si getUser no devuelve ningún registro, retornamos null
                if (!response) return null;
                // Si getUser devuelve un registro, retornamos los datos
                return {
                    id: telf,
                    position: posicion,
                    date: date.timestamp,
                    nombres: response.dataValues.nombres,
                    apellidos: response.dataValues.apellidos,
                    telefono: response.dataValues.telefono,
                    dni: response.dataValues.dni,
                    turno: response.dataValues.TurnoAsociado.nombre,
                    superior: response.dataValues.superior,
                };
            })
        );
        // Filtrar los valores nulos antes de emitir
        const posicionesFiltradas = posiciones.filter(posicion => posicion !== null);
        // Emitir las posiciones resueltas a través de Socket.IO
        io.emit("celpos", posicionesFiltradas);
        return posicionesFiltradas;
    } catch (error) {
        console.error("Error obteniendo ubicaciones:", error);
        return [];
    }
};

module.exports = { getUbicaciones };