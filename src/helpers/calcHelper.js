const roundTo = (num, decimals) => {
    //return Number(num.toFixed(decimals));
    return Math.round(Number(num) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Función para convertir metros a grados
function metersToDegrees(meters) {
    const earthRadius = 6371000; // Radio de la Tierra en metros
    const degrees = meters / (earthRadius * Math.PI / 180);
    return degrees;
}

module.exports = { roundTo, metersToDegrees }