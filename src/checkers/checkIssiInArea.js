const turf = require('@turf/turf');
const { roundTo, metersToDegrees } = require("../helpers/calcHelper");
const { getSubsectorById } = require("../controllers/subsectorController");

const BOUNDS_DISTANCE_METERS = 301; // Distancia en metros en cada lado del cuadrado para vigilancia
const degreesOffset = metersToDegrees(BOUNDS_DISTANCE_METERS / 2);

// Función para verificar si una ISSI está dentro del área
const checkIssiInArea = (position, center) => {

    const issiPoint = turf.point([roundTo(position.latitud, 12), roundTo(position.longitud, 12)]);
    const bounds = [
        [center[0] + degreesOffset, center[1] - degreesOffset], // Esquina superior izquierda
        [center[0] + degreesOffset, center[1] + degreesOffset], // Esquina superior derecha
        [center[0] - degreesOffset, center[1] + degreesOffset], // Esquina inferior derecha
        [center[0] - degreesOffset, center[1] - degreesOffset], // Esquina inferior izquierda
        [center[0] + degreesOffset, center[1] - degreesOffset], // Esquina superior izquierda para cerrar el area
    ];
    const area = turf.polygon([bounds]);

    return turf.booleanPointInPolygon(issiPoint, area);
};


const drawArea = async (point, options) => {

    const radio = 150 / 1000; // Convertimos metros a kilómetros para Turf.js
    let bounds = null;
    /// options.tipo: 0 = circulo  , 1 = cuadrado   , 2 = poligono
    switch (options.tipo) {
        case 0: // Círculo
            // Asegúrate de que `point` sea un array de [longitud, latitud]
            bounds = turf.circle([point[0], point[1]], radio, { steps: 64 });
            break;

        case 1: // Cuadrado
            // Crear un cuadrado con los valores de grados
            bounds = turf.bboxPolygon([
                point[0] - degreesOffset,
                point[1] - degreesOffset,
                point[0] + degreesOffset,
                point[1] + degreesOffset
            ]);
            break;
            case 2: // Polígono basado en subsector desde la base de datos
            const response = await getSubsectorById(options.valor);
            if (!response || !response.dataValues || !response.dataValues.puntos) {
                bounds = null;
                break;
            }
            // Acceder al campo `puntos` que contiene la geometría del polígono
            const { puntos } = response.dataValues;
                bounds = turf.polygon(puntos.geometry.coordinates);
                break;
        default:
            bounds = false;
            break;
    }

    return bounds;
}

const checkIfPointisInArea = async (position, point, options = {}) => {
    // Convertir coordenadas y redondearlas a 12 decimales
    const issiCoordinates = turf.point([
        roundTo(position.latitud, 12),
        roundTo(position.longitud, 12)
    ]);
    const bounds = await drawArea(point, JSON.parse(options)); // options llega como JSON
    // Verificar si el punto está dentro de los límites definidos
    return turf.booleanPointInPolygon(issiCoordinates, bounds);
};

module.exports = { checkIssiInArea, checkIfPointisInArea };
