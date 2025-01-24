const axios = require("axios");
const { getRealTimeUnidadesHeader } = require("../helpers/realTimeUnidadesHeader");

const { LISTAR_UNIDADES_GPS } = process.env;

const getRealTimeUnidades = async (payload) => {
    try {
        const { data, status } = await axios.post(LISTAR_UNIDADES_GPS, payload, getRealTimeUnidadesHeader(payload));
        if (status === 200 && data)
            return { data, status };
        else
            return null;
    } catch (error) {
        console.error('Error en la peticion de las unidades:', error.message);
        return null;
    }

};


module.exports = { getRealTimeUnidades };