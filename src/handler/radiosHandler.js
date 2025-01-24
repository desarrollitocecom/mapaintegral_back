const { getRadios, getRadio, createRadio, updateRadio, deleteRadio } = require("../controllers/radiosController");

// Handler para obtener todas las radios
const getRadiosHandler = async (req, res) => {
    try {
        const response = await getRadios();
        if (!response.length) {
            return res.status(200).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error al obtener detalle de radios:", error.message);
        return res.status(500).json({ message: "Error al obtener detalle de radios" });
    }
};

// Handler para obtener una radio por ISSI
const getRadioHandler = async (req, res) => {
    const { issi } = req.params;
    try {
        const response = await getRadio(issi);
        if (!response) {
            return res.status(204).json({ message: `No se encontró la radio con ISSI ${issi}` });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(`Error al obtener la radio con ISSI ${issi}:`, error.message);
        return res.status(500).json({ message: "Error al obtener la radio" });
    }
};

// Handler para crear una nueva radio
const createRadioHandler = async (req, res) => {
    const radioData = req.body;
    const errors = [];

    if (!radioData.issi)
        errors.push("Issi no es un numero o no existe");

    if (!radioData.fuente)
        errors.push("Fuente no existe o no es texto");

    if (!radioData.informacion.cargo && !radioData.informacion.unidad)
        errors.push("Informacion no existe o los campos cargo o unidad no existen");

    if (errors.length > 0)
        return res.status(400).json({ message: errors.join(", ") });

    try {
        const response = await createRadio(radioData);
        if (!response)
            return res.status(409).json({ message: "conflicto al crear la radio" });
        return res.status(201).send(response);
    } catch (error) {
        console.error("Error al crear la radio:", error.message);
        return res.status(500).json({ message: "Error al crear la radio" });
    }
};

// Handler para actualizar una radio existente por ISSI
const updateRadioHandler = async (req, res) => {
    const { issi } = req.params;
    const radioData = req.body;
    try {
        const response = await updateRadio(issi, radioData);
        if (!response) {
            return res.status(204).json({ message: `No se encontró la radio con ISSI ${issi}` });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error(`Error al actualizar la radio con ISSI ${issi}:`, error.message);
        return res.status(500).json({ message: "Error al actualizar la radio" });
    }
};

// Handler para eliminar una radio por ISSI
const deleteRadioHandler = async (req, res) => {
    const { issi } = req.params;
    if (!issi)
        return res.status(400).json({ message: "No se detecto issi" });
    try {
        const response = await deleteRadio(issi);
        if (!response) {
            return res.status(204).json({ message: `No se encontró la radio con ISSI ${issi}` });
        }
        return res.status(200).json({ message: `Radio con ISSI ${issi} eliminada correctamente` });
    } catch (error) {
        console.error(`Error al eliminar la radio con ISSI ${issi}:`, error.message);
        return res.status(500).json({ message: "Error al eliminar la radio" });
    }
};


module.exports = {
    getRadiosHandler,
    getRadioHandler,
    createRadioHandler,
    updateRadioHandler,
    deleteRadioHandler
};
