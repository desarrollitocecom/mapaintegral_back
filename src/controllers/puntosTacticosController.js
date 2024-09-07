const PuntoTactico = require("../models/PuntosTacticos");
const Turno = require("../models/Turno");
const Zona = require("../models/Zona");

// Obtener todos los puntos tácticos incluyendo zonas y turnos
const getPuntosTacticos = async () => {
    try {
        const response = await PuntoTactico.findAll({
            include: [
                {
                    model: Turno,
                    as: 'TurnoAsociado',  // Usa el alias correcto
                    attributes: ['id', 'nombre']
                },
                {
                    model: Zona,
                    as: 'ZonaAsociada',  // Usa el alias correcto
                    attributes: ['id', 'nombre']
                }
            ]
        });
        return response || [];
    } catch (error) {
        console.error("Error en getPuntosTacticos:", error.message);
        return false;
    }
};


// Obtener un punto táctico por ID
const getPuntoTacticoById = async (id) => {
    try {
        const response = await PuntoTactico.findByPk(id,
            {
                include: [
                    {
                        model: Turno,
                        as: 'TurnoAsociado',  // Usa el alias correcto
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Zona,
                        as: 'ZonaAsociada',  // Usa el alias correcto
                        attributes: ['id', 'nombre']
                    }
                ]
            }
        );
        return response || null;
    } catch (error) {
        console.error("Error en getPuntoTacticoById:", error.message);
        return false;
    }
};

const createPuntoTactico = async (turno, nombre, zona, puntos) => {
    console.log("datos: ", turno, nombre, zona, puntos);
    try {
        const newPuntoTactico = await PuntoTactico.create({
            turno: turno,
            nombre: nombre,
            zona: zona,
            puntos: puntos
        });
        return newPuntoTactico;
    } catch (error) {
        console.error("Error en createPuntoTactico:", error.message);
        return false;
    }
};

// Actualizar un punto táctico
const updatePuntoTactico = async (id, turno, nombre, zona, puntos) => {
    try {
        const puntoTactico = await PuntoTactico.findByPk(id);
        if (puntoTactico) {
            await puntoTactico.update({
                turno: turno,
                nombre: nombre,
                zona: zona,
                puntos: puntos
            });
            return puntoTactico;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error en updatePuntoTactico:", error.message);
        return false;
    }
};


// Eliminar un punto táctico
const deletePuntoTactico = async (id) => {
    try {
        const puntoTactico = await PuntoTactico.findByPk(id);
        if (puntoTactico) {
            await puntoTactico.destroy();
            return true;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error en deletePuntoTactico:", error.message);
        return false;
    }
};

module.exports = {
    getPuntosTacticos,
    getPuntoTacticoById,
    createPuntoTactico,
    updatePuntoTactico,
    deletePuntoTactico
};
