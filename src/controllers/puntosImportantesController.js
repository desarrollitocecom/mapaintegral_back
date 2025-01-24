const PuntoImportante = require("../models/PuntosImportantes");

// GET /puntosImportantes
// Devuelve todos los puntos importantes

const getAllPuntosImportantes = async () => {

    try {
        const response = await PuntoImportante.findAll();
        if (response.length > 0)
            return response;
        else
            return [];
    } catch (error) {
        console.error(error);
        return false;
    }

};

const getPuntoImportanteById = async (id) => {
    try {
        // Buscar el punto importante por su ID (Primary Key)
        const punto = await PuntoImportante.findByPk(id);

        // Si no se encuentra, retornar null
        if (!punto) {
            return null;
        }

        // Si se encuentra, retornar el punto
        return punto;
    } catch (error) {
        console.error(`Error al obtener el punto importante con ID ${id}:`, error);
        throw new Error("Error al obtener el punto importante.");
    }
};

module.exports = { getAllPuntosImportantes, getPuntoImportanteById }