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


require("./models/Zona");
require("./models/Turno");
require("./models/Radio");
require("./models/PuntosTacticos");
require("./models/Alerta");
require("./models/Subsectores");
require("./models/PuntosImportantes");

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

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  const alerts = fixArrayRedis(await getAlerts());

  socket.emit("alerta", alerts);
  socket.emit("welcome", "bien perro, lo hiciste")

  socket.on('welcome', async (data) => {
    console.log('Alerta recibida:', data);
  });

  socket.on('disconnect', () => {
    //console.log('Cliente desconectado');
  });

});

module.exports = { io, socketServer };
