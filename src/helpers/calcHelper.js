const roundTo = (num, decimals = 12) => {
    //return Number(num.toFixed(decimals));
    return Math.round(Number(num) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Función para convertir metros a grados
function metersToDegrees(meters) {
    const earthRadius = 6371000; // Radio de la Tierra en metros
    const degrees = meters / (earthRadius * Math.PI / 180);
    return degrees;
}

const fixArrayRedis = (rawAlerts) => {
    // Mapear el array y arreglar los strings JSON
    return rawAlerts.map((alert) => {
        try {
            if (alert === '[]') {
                return []; // Si es un array vacío, devolvemos un array vacío
            }

            // Reemplazar los caracteres escapados y parsear el string
            const fixedString = alert.replace(/\\"/g, '"'); // Eliminar los caracteres escapados (\")

            return JSON.parse(fixedString); // Parsear el string corregido a un objeto
        } catch (error) {
            console.error("Error al parsear el alert:", error);
            return null; // Devolver null si hay un error de parseo
        }
    }).filter(alert => alert !== null); // Filtrar cualquier resultado null por errores
};

module.exports = { roundTo, metersToDegrees, fixArrayRedis }