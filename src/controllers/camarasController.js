const camaras_municipales = require("../data/camaras_municipales.json");
const camaras_vecinales = require("../data/camaras_vecinales.json");

const getCamarasMunicipales = async () => {

    try {
        return camaras_municipales; // Devolver los datos directamente
    } catch (error) {
        console.error("Error al obtener las cámaras municipales:", error.message);
        return null;
    }
};

const getCamarasVecinales = async () => {

    try {
        return camaras_vecinales; // Devolver los datos directamente
    } catch (error) {
        console.error("Error al obtener las cámaras vecinales:", error.message);
        return null;
    }
}

module.exports = { getCamarasMunicipales, getCamarasVecinales };
