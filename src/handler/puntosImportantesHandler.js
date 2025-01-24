const { getAllPuntosImportantes, getPuntoImportanteById } = require("../controllers/puntosImportantesController");

// Handler para la ruta GET /puntosImportantes
const getAllPuntosImportantesHandler = async (req, res) => {
    try {
        // Llama al controlador para obtener los puntos importantes
        const puntos = await getAllPuntosImportantes();

        // Si no se encontraron puntos, responde con un mensaje adecuado
        if (puntos.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No se encontraron puntos importantes.",
                data: puntos
            });
        }

        // Si se encontraron puntos, responde con el array de puntos
        return res.status(200).json({
            success: true,
            message: "Puntos importantes obtenidos con éxito.",
            data: puntos
        });
    } catch (error) {
        // Si ocurre algún error, envía un mensaje de error y un código 500
        return res.status(500).json({
            success: false,
            message: "Error al obtener los puntos importantes.",
            error: error.message
        });
    }
};

// Handler para la ruta GET /puntosImportantes/:id
const getPuntoImportanteByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;

        // Llama al controlador para obtener el punto importante por ID
        const punto = await getPuntoImportanteById(id);

        // Si no se encuentra el punto, responde con un código 404
        if (!punto) {
            return res.status(200).json({
                success: false,
                message: `Punto importante con ID ${id} no encontrado.`,
                data: punto
            });
        }

        // Si se encuentra, responde con el punto importante
        return res.status(200).json({
            success: true,
            message: "Punto importante obtenido con éxito.",
            data: punto
        });
    } catch (error) {
        // Si ocurre algún error, envía un mensaje de error y un código 500
        return res.status(500).json({
            success: false,
            message: "Error al obtener el punto importante.",
            error: error.message
        });
    }
};

module.exports = { getAllPuntosImportantesHandler, getPuntoImportanteByIdHandler };

