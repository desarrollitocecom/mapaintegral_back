const Radio = require("../models/Radio");

// Obtener todas las radios
const getRadios = async () => {
    try {
        const response = await Radio.findAll();
        return response || null;
    } catch (error) {
        console.error('Error al obtener todas las radios:', error);
        return false;
    }
};

// Obtener una radio por ISSI
const getRadio = async (issi) => {
    try {
        console.log("issi: ", issi);
        const response = await Radio.findOne({ where: { issi } });
        return response || null;
    } catch (error) {
        console.error("Error al obtener la radio: ", issi, error.message);
        return false;
    }
};

// Crear una nueva radio
const createRadio = async (radioData) => {
    try {
        const newRadio = await Radio.create(radioData);
        return newRadio || null;
    } catch (error) {
        console.error('Error al crear un nuevo radio:', error.message);
        return false;
    }
};

// Actualizar una radio existente por ISSI
const updateRadio = async (issi, radioData) => {
    try {
        const radio = await Radio.findOne({ where: { issi } });
        if (radio) {
            await radio.update(radioData);
            return radio;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al actualizar la radio:', error.message);
        return false;
    }
};

const deleteRadio = (issi) => {
    try {
        Radio.destroy({ where: { issi } });
        return true;
    } catch (error) {
        console.error('Error al eliminar la radio:', error.message);
        return false;
    }
};

module.exports = { getRadios, getRadio, createRadio, updateRadio, deleteRadio };
