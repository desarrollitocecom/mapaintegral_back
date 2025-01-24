const { validateUsuarioMovil } = require('../controllers/usuariosController')
//const { getUser } = require("../controllers/usuariosController");
const redisClient = require("../redisClient");
const sharp = require('sharp');

const verifyPhotoMobileHandler = async (req, res) => {
    const { deviceId } = req.body;
    console.log('este es el deviceId: ', deviceId);

    try {

        if (!req.files || !req.files['fotoMobile']) {
            return res.status(400).json({
                success: false,
                message: "No se recibió ninguna imagen. Por favor, intente nuevamente."
            });
        }
        const filePath = req.files['fotoMobile'][0].path;

        const imageBuffer = await sharp(filePath)
            .rotate()
            .toBuffer();

        const base64Image = imageBuffer.toString('base64');
        const datos = {
            foto: base64Image
        };

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': '972cbc17838710f8179133d624ed3c4646034b2bcbbea6dfe5da154fd4f046a6'
        };

        const response = await fetch('https://backendtareaje.munisjl.gob.pe/axxon/face', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                success: false,
                message: errorData.message || "Error al procesar la imagen en la API externa."
            });
        }

        const data = await response.json();
        console.log(data.message);

        const dni = data.data.dni;

        const dniValidate = await validateUsuarioMovil(dni);
        if (!dniValidate) {
            return res.status(200).json({
                success: false,
                message: "Este DNI no está registrado.",
                data: {
                    nombres: data.data.nombres,
                    apellidos: data.data.apellidos,
                    telefono: data.data.celular,
                    dni: data.data.dni,
                    turno: data.data.turno.nombre
                }
            });
        }

        if ( deviceId != dniValidate.member ) {
            return res.status(400).json({
                success: false,
                message: "Este Dispositivo está asociado a otra persona"
            });
        }

        if ( dniValidate.state == false ) {
            return res.status(400).json({
                success: false,
                message: "Por favor espere mientras un superior lo acepta"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inicio de Servicio.",
        });

    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error interno al procesar la solicitud.",
            error: error.message,
        });
    }

};



const getUbicacionesHandler = async (req, res) => {
    try {
        // Obtener los IDs de los teléfonos (miembros del sorted set)
        const telefonos = await redisClient.zRange("ubicaciones", 0, -1);

        if (telefonos.length === 0) {
            // Si no hay teléfonos, devolver un array vacío
            return res.status(200).json([]);
        }

        // Usar Promise.all para resolver todas las promesas del map
        const posiciones = await Promise.all(
            telefonos.map(async (telf) => {
                const posicion = await redisClient.geoPos("ubicaciones", telf);
                const date = await redisClient.hGetAll(`ubicacion:${telf}`);
                // const response = await getUser(telf);

                // // Si getUser no devuelve ningún registro, retornar null
                // if (!response) return null;

                // Retornar los datos si getUser devuelve un registro
                return {
                    id: telf,
                    position: posicion,
                    date: date.timestamp,
                    // nombres: response.dataValues.nombres,
                    // apellidos: response.dataValues.apellidos,
                    // telefono: response.dataValues.telefono,
                    // dni: response.dataValues.dni,
                    // turno: response.dataValues.TurnoAsociado.nombre,
                    // superior: response.dataValues.superior,
                };
            })
        );

        // Filtrar los valores nulos antes de devolver la respuesta
        const posicionesFiltradas = posiciones.filter((posicion) => posicion !== null);

        // Devolver las posiciones resueltas como respuesta JSON
        return res.status(200).json(posicionesFiltradas);
    } catch (error) {
        console.error("Error obteniendo ubicaciones:", error);

        // Devolver un error 500 con el mensaje de error
        return res.status(500).json({ error: "Error obteniendo ubicaciones" });
    }
};


module.exports = { verifyPhotoMobileHandler, getUbicacionesHandler };
