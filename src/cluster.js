require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;
const sequelize = require("./database");
const { login } = require("./controllers/loginController");
const { setUnidades, monitorIssis } = require("./checkers/vigilanciaIssis");
const { getUbicaciones } = require("./sockets/posiciones");
const { socketServer } = require("./server");
const cache = require("./cache");
const redisClient = require("./redisClient");

const { PORT } = process.env;

if (cluster.isPrimary) {

    login(); // logeas para levantar datos de sesion en caso no se haya llamado a unidades realtime antes de algun peticion que requiera sesion de inicio.
    console.log(`Master process ${process.pid} is running`);
    // Sincronización de la base de datos solo en el proceso master
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Base de datos sincronizada correctamente.');
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
        })
        .catch(error => {
            console.error('Error en la sincronización de la base de datos: ', error);
        });
    // Manejar la salida de los workers
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork(); // Crear un nuevo worker si uno muere
    });

    const assignIssisToWorkers = async () => {
        if (!redisClient.isOpen) await redisClient.connect();
    
        const issis = await redisClient.keys('vigilancia:*');
        const workers = Object.values(cluster.workers);
        const numWorkers = workers.length;
        const issisPerWorker = Math.ceil(issis.length / numWorkers);
    
        workers.forEach((worker, index) => {
          const start = index * issisPerWorker;
          const end = start + issisPerWorker;
          const issisForWorker = issis.slice(start, end);
          worker.send({ issis: issisForWorker });
        });
      };
    assignIssisToWorkers();
    setInterval(assignIssisToWorkers, 2000); // Actualizar asignaciones cada minuto (ajusta según tus necesidades)

    setInterval(setUnidades, 10000);
    setInterval(monitorIssis, 5000);
    setInterval(getUbicaciones, 15000);
} else {
    console.log(`Worker process ${process.pid} started`);
    socketServer.listen(PORT, async () => {
        try {
            const log = await login();
            if (log)
                console.log(`Servidor corriendo en el puerto ${PORT} & logeado correctamente con ${cache.get("sesion")._empresa}`);
            else
                console.error("Error en el inicio de sesión en Dolphin, verifica las credenciales de inicio o el endpoint - fallo en el server");
        } catch (error) {
            console.error("No se pudo iniciar el servidor: ", error);
        }
    });
    //require("./server");  // Solo levantamos el servidor en los workers
}
/* 

Master: El bloque if (cluster.isMaster) se ejecuta en el proceso principal. Aquí se crean los procesos workers usando cluster.fork(), que hace una copia del código en cada núcleo del procesador disponible.

Workers: Los workers ejecutan el mismo código que el proceso master, pero manejan las solicitudes HTTP de manera independiente. El servidor HTTP está en cada worker, y las solicitudes se distribuyen entre ellos.

Reemplazo de workers: Si un worker falla, el proceso principal detecta el fallo y lo reemplaza automáticamente creando un nuevo worker.

*/
