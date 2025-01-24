const axios = require("axios");
const { getTiposUnidadesHeader } = require("../helpers/tiposUnidadesHeader");

const { LISTAR_TIPOS_UNIDADES } = process.env;

const getTipoUnidad = async () => {

    try {
        const { data, status } = await axios.post(LISTAR_TIPOS_UNIDADES, null, getTiposUnidadesHeader);
        if (status === 200 && data)
            return {
                status,
                data
            };
        else
            return null;
    } catch (error) {
        console.error('Error en la solicitud POST de Listar Tipos de Unidades:', error.message);
        return null;
    }

};

module.exports = { getTipoUnidad };