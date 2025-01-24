const axios = require("axios");
const { getEstadosHeader } = require("../helpers/estadosHeader");

const { GPS_LISTAR_ESTADOS } = process.env;

const getEstadosRadio = async () => {
    try {
        const { data, status } = await axios.post(GPS_LISTAR_ESTADOS, null, getEstadosHeader);
        if (status === 200 && data) {
            return {
                status,
                data
            };
        }
        else
            return null;
    } catch (error) {
        console.error('Error en la solicitud POST de GPS Listar Estados:', error.message);
        return null;
    }
};

module.exports = { getEstadosRadio };