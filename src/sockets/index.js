// Esta función maneja toda la lógica de los sockets
const socketHandler = (io) => {
    io.on('connection', async (socket) => {
      //console.log('Nuevo cliente conectado');
  
      // Emitir mensajes iniciales al cliente
      const alerts = fixArrayRedis(await getAlerts());
      socket.emit("alerta", alerts);
      socket.emit("welcome", "Conexión exitosa");
  
      // Recibir ubicaciones desde los dispositivos
      socket.on('ubicacion', async (data) => {
        try {
          const { deviceId, latitude, longitude } = data;
          const x = roundTo(longitude);
          const y = roundTo(latitude);
  
          await redisClient.geoAdd('ubicaciones', {
            longitude: x,
            latitude: y,
            member: deviceId,
          });
  
          //console.log(`Ubicación guardada para ${deviceId}: (${latitude}, ${longitude})`);
        } catch (error) {
          console.error('Error al procesar la ubicación:', error);
        }
      });
  
      // Enviar ubicaciones al frontend cada 5 segundos
      const intervalId = setInterval(async () => {
        const ubicaciones = await getUbicaciones();
        socket.emit('ubicaciones', ubicaciones);
      }, 5000);
  
      socket.on('disconnect', () => {
        //console.log('Cliente desconectado');
        clearInterval(intervalId);
      });
    });
  };
  
  // Exportamos la función socketHandler
  module.exports = socketHandler;