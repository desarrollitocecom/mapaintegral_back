const turf = require('@turf/turf');
const { roundTo, metersToDegrees } = require("../helpers/calcHelper");

const BOUNDS_DISTANCE_METERS = 301; // Distancia en metros en cada lado del cuadrado para vigilancia
const degreesOffset = metersToDegrees(BOUNDS_DISTANCE_METERS / 2);

// Función para verificar si una ISSI está dentro del área
const checkIssiInArea = (position, center) => {
    const issiPoint = turf.point([roundTo(position.latitud, 12), roundTo(position.longitud, 12)]);
    console.log("issipoint", typeof roundTo(position.latitud, 12));
    
    const bounds = [
        [center[0] + degreesOffset, center[1] - degreesOffset], // Esquina superior izquierda
        [center[0] + degreesOffset, center[1] + degreesOffset], // Esquina superior derecha
        [center[0] - degreesOffset, center[1] + degreesOffset], // Esquina inferior derecha
        [center[0] - degreesOffset, center[1] - degreesOffset], // Esquina inferior izquierda
        [center[0] + degreesOffset, center[1] - degreesOffset], // Esquina superior izquierda para cerrar el area
    ];
    //console.log("area turf: ",bounds);
    const area = turf.polygon([bounds]);
    //console.log("issiPoint: ",issiPoint);
    return turf.booleanPointInPolygon(issiPoint, area);
};

module.exports = { checkIssiInArea };