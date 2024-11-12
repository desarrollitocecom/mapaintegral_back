require("dotenv").config();
const express = require('express');
const server = express();
const http = require('http');
const socketServer = http.createServer(server);
const routes = require("./routes/index");
const cors = require('cors');
const morgan = require('morgan');
const socketIo = require('socket.io');
const redisAdapter = require('socket.io-redis');
const cache = require("./cache");
const redisClient = require("./redisClient");
const { fixArrayRedis } = require("./helpers/calcHelper");
const { roundTo } = require("./helpers/calcHelper");


require("./models/Zona");
require("./models/Turno");
require("./models/Radio");
require("./models/PuntosTacticos");
require("./models/Alerta");
require("./models/Subsectores");
require("./models/PuntosImportantes");
require("./models/Usuario");

// Middleware para permitir CORS desde cualquier origen
server.use(cors());

// Middleware para parsear JSON y formularios
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Rutas
server.use("/", routes);

// Configuración de Socket.IO
const io = socketIo(socketServer, {
  cors: {
    origin: "*",  // Permitir todos los orígenes, o especificar el origen que necesites
    methods: ["GET", "POST"],  // Métodos permitidos
    credentials: true  // Habilitar envío de cookies si lo necesitas
  }
});

const getAlerts = async () => {
  try {
    if (!redisClient.isOpen)
      await redisClient.connect();
    const alerts = await redisClient.lRange("alerts", 0, -1);
    return alerts.length > 0 ? alerts : [];
  } catch (error) {
    console.error(error);
  }
};

io.adapter(redisAdapter({ host: 'localhost', port: 6379 })); // para conectar a los workers entre ellos se usa redis y este adaptador

// server.js
io.on('connection', async (socket) => {
  //console.log('Nuevo cliente conectado');

  // Emitir mensajes iniciales al cliente
  const alerts = fixArrayRedis(await getAlerts());
  socket.emit("alerta", alerts);
  socket.emit("welcome", "Conexión exitosa"); //164.163.184.17:3001 - SERENAZGO // 164.163.184.17:3000 - TRANSPORTE

  // Recibir ubicaciones desde los dispositivos
  socket.on('ubicacion', async (data) => {
    try {
      // Estructura esperada del 'data': { id, lat, lng, timestamp }

      const { member, latitude, longitude } = data;
      const x = roundTo(longitude);
      const y = roundTo(latitude);
      console.log(data);
      const timestamp = new Date().toISOString(); // Obtener la hora en formato ISO
      // Guardar la ubicación en Redis
      await redisClient.geoAdd('ubicaciones',
        {
          longitude: x,
          latitude: y,
          member: member,
        });
      // Guardar el timestamp en un hash asociado al 'member'
      await redisClient.hSet(`ubicacion:${member}`, {
        timestamp: timestamp
      });
      
      //console.log(`Ubicación guardada para ${member}: (${latitude}, ${longitude}) a las ${timestamp}`);
    } catch (error) {
      console.error('Error al procesar la ubicación:', error);
    }
  });

  // Evento cuando el cliente se desconecta
  socket.on('disconnect', () => {
   //console.log('Cliente desconectado');
  });
});

module.exports = { io, socketServer };
