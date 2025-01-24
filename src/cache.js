// src/cache.js
const NodeCache = require('node-cache');

// Crear una instancia de NodeCache con un TTL infinito
const cache = new NodeCache({ stdTTL: 0 }); // TTL infinito ( Time to Live )

module.exports = cache;