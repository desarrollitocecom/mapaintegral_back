const Subsector = require("../models/Subsectores");

// GET /subsectores
// Devuelve todos los subsectores
const getAllSubsectores = async () => {
    try {
        const response = await Subsector.findAll();
        if (response.length > 0) {
            return response;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener los subsectores:", error);
        throw new Error("Error al obtener los subsectores.");
    }
};

// GET /subsectores/:id
// Devuelve un subsector por su ID
const getSubsectorById = async (id) => {
    try {
        const subsector = await Subsector.findByPk(id);
        if (!subsector) {
            return null;
        }
        return subsector;
    } catch (error) {
        console.error(`Error al obtener el subsector con ID ${id}:`, error);
        throw new Error("Error al obtener el subsector.");
    }
};


module.exports = { getAllSubsectores, getSubsectorById };