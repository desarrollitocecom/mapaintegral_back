const { createAlert, getAlert, getAlerts, closeAlert } = require("../controllers/alertasController");

// 1. Handler para crear una nueva alerta
const createAlertHandler = async (req, res) => {
    const { issi, tipo, point, position, information } = req.body;
    const errors = [];
    if (issi === null || undefined)
        errors.push("issi no detectada");
    if (tipo === null || undefined)
        errors.push("tipo no detectado");
    if ((point.latitud === null || undefined) && (point.longitud === null || undefined))
        errors.push("punto no detectado");
    if ((position.latitud === null || undefined) && (position.longitud === null || undefined))
        errors.push("posicion no detectada");
    if (information === null || undefined)
        errors.push("informacion no detectada");
    if (errors.length > 0)
        return res.status(400).json({ message: "Error al crear la alerta", errors: errors });

    //console.log( issi, tipo, point, position, information);
    try {
        const response = await createAlert(issi, tipo, point, position, information);
        if (response) {
            return res.status(201).json({
                message: "Alerta creada correctamente",
                data: response
            });
        } else {
            return res.status(400).json({ message: "No se pudo crear la alerta" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor al crear la alerta", error: error.message });
    }
};

// 2. Handler para obtener todas las alertas para un ISSI específico
const getAlertsHandler = async (req, res) => {
    const { issi } = req.params; // ISSI pasado como parámetro en la URL
    try {
        const response = await getAlerts(issi);
        if (response.length > 0) {
            return res.status(200).json(response);
        } else {
            return res.status(200).json({ message: "No se encontraron alertas para el ISSI proporcionado", response });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor al obtener las alertas", error: error.message });
    }
};

// 3. Handler para obtener una alerta específica por su ID
const getAlertHandler = async (req, res) => {
    const { id } = req.params; // ID de la alerta pasado como parámetro en la URL

    try {
        const response = await getAlert(id);
        if (response) {
            return res.status(200).json(response);
        } else {
            return res.status(200).json({ message: "Alerta no encontrada", response });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor al obtener la alerta", error: error.message });
    }
};

// 4. Handler para cerrar (actualizar) una alerta específica
const closeAlertHandler = async (req, res) => {
    const { id } = req.params; // ID de la alerta pasado como parámetro en la URL

    try {
        const response = await closeAlert(id);
        if (response) {
            return res.status(200).json({ message: "Alerta cerrada correctamente" });
        } else {
            return res.status(400).json({ message: "Alerta no encontrada o no se pudo cerrar" });
        }
    } catch (error) {
        console.error('Error al cerrar la alerta:', error);
        return res.status(500).json({ message: "Error del servidor al cerrar la alerta", error: error.message });
    }
};

// 5. Handler para eliminar una alerta específica
/*const deleteAlertHandler = async (req, res) => {
    const { id } = req.params; // ID de la alerta pasado como parámetro en la URL

    try {
        const response = await Alerta.destroy({ where: { id } });
        if (response > 0) {
            return res.status(200).json({ message: "Alerta eliminada correctamente" });
        } else {
            return res.status(404).json({ message: "Alerta no encontrada" });
        }
    } catch (error) {
        console.error('Error al eliminar la alerta:', error);
        return res.status(500).json({ message: "Error del servidor al eliminar la alerta", error: error.message });
    }
};*/

module.exports = {
    createAlertHandler,
    getAlertsHandler,
    getAlertHandler,
    closeAlertHandler,
    //deleteAlertHandler
};
