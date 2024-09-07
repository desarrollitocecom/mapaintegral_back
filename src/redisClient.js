const redis = require('redis');

// Crear el cliente de Redis usando la nueva API con promesas
const redisClient = redis.createClient({
    url: 'redis://localhost:6379' // Define el host y el puerto correctamente
});

// Manejar la conexión y posibles errores
redisClient.on('connect', () => {
    console.log('Conectado a Redis');
});

redisClient.on('ready', () => {
    console.log('Redis está listo para aceptar comandos');
});

redisClient.on('error', (err) => {
    console.error('Error en Redis:', err);
});

redisClient.on('end', () => {
    console.log('Conexión con Redis cerrada');
});

module.exports = redisClient;
