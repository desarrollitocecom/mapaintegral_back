const { getAllSectores, getSectorById } = require("../controllers/sectorController");

// Handler para la ruta GET /Sectores
const getAllSectoresHandler = async (req, res) => {
    try {
        const Sectores = await getAllSectores();
        if (Sectores.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No se encontraron Sectores.",
                data: Sectores
            });
        }
        return res.status(200).json({
            success: true,
            message: "Sectores obtenidos con éxito.",
            data: Sectores
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los Sectores.",
            error: error.message
        });
    }
};

// Handler para la ruta GET /Sectores/:id
const getSectorByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const errors = [];
        if (!id)
            errors.push("El campo ID es obligatorio.");
        if (isNaN(id))
            errors.push("El campo ID debe ser un número.");
        if (errors.length > 0)
            return res.status(400).json({
                success: false,
                message: "Error en los campos enviados.",
                errors: errors
            });

        const sector = await getSectorById(id);

        if (!sector) {
            return res.status(200).json({
                success: false,
                message: `sector con ID ${id} no encontrado.`,
                data: sector
            });
        }

        return res.status(200).json({
            success: true,
            message: "sector obtenido con éxito.",
            data: sector
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el sector.",
            error: error.message
        });
    }
};

module.exports = { getAllSectoresHandler, getSectorByIdHandler };