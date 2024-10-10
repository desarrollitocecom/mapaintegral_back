const { getAllSubsectores, getSubsectorById } = require("../controllers/subsectorController");

// Handler para la ruta GET /subsectores
const getAllSubsectoresHandler = async (req, res) => {
    try {
        const subsectores = await getAllSubsectores();
        if (subsectores.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No se encontraron subsectores.",
                data: subsectores
            });
        }
        return res.status(200).json({
            success: true,
            message: "Subsectores obtenidos con éxito.",
            data: subsectores
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los subsectores.",
            error: error.message
        });
    }
};

// Handler para la ruta GET /subsectores/:id
const getSubsectorByIdHandler = async (req, res) => {
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

        const subsector = await getSubsectorById(id);

        if (!subsector) {
            return res.status(200).json({
                success: false,
                message: `Subsector con ID ${id} no encontrado.`,
                data: subsector
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subsector obtenido con éxito.",
            data: subsector
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el subsector.",
            error: error.message
        });
    }
};

module.exports = { getAllSubsectoresHandler, getSubsectorByIdHandler };