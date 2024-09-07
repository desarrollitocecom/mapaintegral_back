const qs = require("qs");
const cache = require("../cache");
const { getRealTimeUnidades } = require("../controllers/realTimeUnidadesController");
const { checkIssiInArea } = require("./checkIssiInArea");
const { getIssiInfo } = require("../controllers/IssisController");
const redisClient = require("../redisClient");
const { roundTo } = require("../helpers/calcHelper");

const monitorIssis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    // Obtener las ISSIs activas para vigilar
    const issis = await redisClient.keys('vigilancia:*');
    if (issis.length > 0) {
        for (const key of issis) {
            const issi = key.split(':')[1]; // obtiene la issi actual
            const { point, position } = await getIssiInfo(22200); // obtiene la ubicacion y el punto a vigilar de la issi
            const centerPoint = [roundTo(point.latitud), roundTo(point.longitud)];
            console.log("CP",point.latitud);
            const isInside = checkIssiInArea(position, centerPoint);
            //console.log("asd", isInside);
            if (isInside) {
                console.log(`ISSI ${issi} esta dentro del área`);
            }
        }
    }
    // Ejecutar la vigilancia cada 10 segundos
    //setInterval(() => monitorIssis, 10000);
}

// Función para consultar la API de Unidades y almacenar en Redis
const setUnidades = async () => {

    const unidadespayload = qs.stringify({
        vidusuario: cache.get("sesion")._idusuario,
        vidtipo: 0,
        videstado: "TODOS",
        vtipousuario: cache.get("sesion")._tipo,
        vorden: 1,
        vissi: ""
    });

    try {
        const { data } = await getRealTimeUnidades(unidadespayload);
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        data.map(async (unidad) => {
            const issi = unidad._issi;
            await redisClient.hSet(`unidades:${issi}`, {
                latitud: unidad._latitud,
                longitud: unidad._longitud
            })
        });
    } catch (error) {
        console.error('Error actualizando setUnidades:', error);
    }
};

module.exports = { setUnidades, monitorIssis }
