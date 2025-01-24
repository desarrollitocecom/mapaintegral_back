const Sector = require("../models/Sector");

// GET /sectores
// Devuelve todos los subsectores
const getAllSectores = async () => {
    try {
        const response = await Sector.findAll();
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

// GET /sectores/:id
// Devuelve un subsector por su ID
const getSectorById = async (id) => {
    try {
        const sector = await Sector.findByPk(id);
        if (!sector) {
            return null;
        }
        return sector;
    } catch (error) {
        console.error(`Error al obtener el sector con ID ${id}:`, error);
        throw new Error("Error al obtener el sector.");
    }
};


module.exports = { getAllSectores, getSectorById };