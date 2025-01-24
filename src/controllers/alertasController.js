const Alerta = require("../models/Alerta");


const createAlert = async (issi, tipo, point, position, information) => {
    try {
        const response = Alerta.create({
            issi: issi,
            tipo: tipo,
            point: point,
            position: position,
            information: information
        });
        if (response)
            return response;
        else
            return null;
    } catch (error) {
        console.error("Error en createAlert: ", error);
        return false;
    }
};

const getAlerts = async (issi) => {
    try {
        const response = await Alerta.findAll({
            where:
                { issi: issi }
        });
        if (response.length > 0)
            return response;
        else
            return [];
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getActiveAlert = async (issi) => {
    try {
        const response = await Alerta.findAll({
            where: { issi, state: true }
        });
        //console.log(response);
        if (response.length > 0)
            return response[response.length - 1].dataValues;
        else
            return null;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const getAlert = async (id) => {
    try {
        const response = await Alerta.findOne({ where: { id: id } });
        if (response)
            return response;
        else
            return null;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const closeAlert = async (id) => {
    try {
        const response = await Alerta.findOne({ where: { id: id } });
        if (response) {
            await response.update({ is_inside: true });
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('Error al cerrar la alerta:', error);
        return false;
    }
};

const deleteAlert = async (issi) => {
    try {
        // Encuentra todas las alertas que coinciden con los criterios
        const responses = await Alerta.findAll({
            where: {
                issi: issi,
                state: true,
                is_inside: false
            }
        });
        if (responses.length > 0) {
            // Itera sobre todas las alertas encontradas y actualiza el estado
            await Promise.all(
                responses.map(async (alert) => {
                    await alert.update({ state: false });
                })
            );
            return true;
        } else {
            return false; // No se encontraron alertas activas
        }
    } catch (error) {
        console.error('Error al cerrar la alerta:', error);
        return false;
    }
};


module.exports = { createAlert, getAlert, getAlerts, closeAlert, getActiveAlert, deleteAlert }