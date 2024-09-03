const { getRadios, getRadio, createRadio, updateRadio, deleteRadio } = require("../controllers/radiosController");

// Handler para obtener todas las radios
const getRadiosHandler = async (req, res) => {
    try {
        const response = await getRadios();
        if (!response.length) {
            return res.status(404).send({ message: "No se encontraron radios" });
        }
        return res.status(200).send(response);
    } catch (error) {
        console.error("Error al obtener detalle de radios:", error.message);
        return res.status(500).send({ message: "Error al obtener detalle de radios" });
    }
};

// Handler para obtener una radio por ISSI
const getRadioHandler = async (req, res) => {
    const { issi } = req.params;
    try {
        const response = await getRadio(issi);
        if (!response) {
            return res.status(404).send({ message: `No se encontró la radio con ISSI ${issi}` });
        }
        return res.status(200).send(response);
    } catch (error) {
        console.error(`Error al obtener la radio con ISSI ${issi}:`, error.message);
        return res.status(500).send({ message: "Error al obtener la radio" });
    }
};

// Handler para crear una nueva radio
const createRadioHandler = async (req, res) => {
    const radioData = req.body;
    try {
        const response = await createRadio(radioData);
        return res.status(201).send(response);
    } catch (error) {
        console.error("Error al crear la radio:", error.message);
        return res.status(500).send({ message: "Error al crear la radio" });
    }
};

// Handler para actualizar una radio existente por ISSI
const updateRadioHandler = async (req, res) => {
    const { issi } = req.params;
    const radioData = req.body;
    try {
        const response = await updateRadio(issi, radioData);
        if (!response) {
            return res.status(404).send({ message: `No se encontró la radio con ISSI ${issi}` });
        }
        return res.status(200).send(response);
    } catch (error) {
        console.error(`Error al actualizar la radio con ISSI ${issi}:`, error.message);
        return res.status(500).send({ message: "Error al actualizar la radio" });
    }
};

// Handler para eliminar una radio por ISSI
const deleteRadioHandler = async (req, res) => {
    const { issi } = req.params;
    try {
        const response = await deleteRadio(issi);
        if (!response) {
            return res.status(404).send({ message: `No se encontró la radio con ISSI ${issi}` });
        }
        return res.status(200).send({ message: `Radio con ISSI ${issi} eliminada correctamente` });
    } catch (error) {
        console.error(`Error al eliminar la radio con ISSI ${issi}:`, error.message);
        return res.status(500).send({ message: "Error al eliminar la radio" });
    }
};


module.exports = {
    getRadiosHandler,
    getRadioHandler,
    createRadioHandler,
    updateRadioHandler,
    deleteRadioHandler
};
