require("dotenv").config();
const express = require('express');
const server = express();
const routes = require("./routes/index");
const cors = require('cors');
const cache = require("./cache");
const { login } = require("./controllers/loginController");
const sequelize = require("./database");

require("./models/Zona");
require("./models/Turno");
require("../src/models/Radio");
require("../src/models/PuntosTacticos");


const { PORT } = process.env;

// Middleware para permitir CORS desde cualquier origen
server.use(cors());

// Middleware para parsear JSON
server.use(express.json());

// Middleware para parsear datos URL-encoded (como los enviados por formularios)
server.use(express.urlencoded({ extended: true }));

server.use("/", routes);

// Inicia el servidor en el puerto
server.listen(PORT, async () => {
  try {
    const log = await login();
    await sequelize.authenticate(); // Verifica si la conexión es exitosa
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync({ alter: true });
    if (log)
      console.log(`Servidor corriendo en el puerto ${PORT} & logeado correctamente con ${cache.get("sesion")._empresa}`);
    else
      console.error("Error en el inicio de sesion en Dolphin, verifica las credenciales de inicio o el endpoint - fallo en el server");
  } catch (error) {
    console.error("No se pudo iniciar servidor: ", error);
  }
});


module.exports = cache;