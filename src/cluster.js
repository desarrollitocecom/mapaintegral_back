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

const { PORT_SERENAZGO } = process.env;

if (cluster.isPrimary) {
    login(); // logeas para levantar datos de sesion en caso no se haya llamado a unidades realtime antes de algun peticion que requiera sesion de inicio.
    // Inicializar Redis para el proceso master
    const { io } = require('./server');

    const { createClient } = require('redis');
    const redisSubscriber = createClient();
    (async () => {
        try {
            await redisSubscriber.connect();

            const alerts = new Map();

            await redisSubscriber.subscribe('alerts_channel', (message) => {
                const alert = JSON.parse(message);
                //console.log("alert:", alert);
                //console.log("se supone que envie alerta");
                if (alert.action === "deleteAll") {
                    alerts.clear();
                    io.emit('alerta', []);
                    return;
                }

                if (alert.action === "delete") {
                    //console.log(alert);
                    const ex = alerts.delete(alert.issi)
                    //console.log("delete:", ex);
                    const alertsArray = Array.from(alerts.values());
                    //console.log(alertsArray);
                    io.emit('alerta', alertsArray);
                    return;
                }

                if (alert.isInside === false) {
                    // Añadir o actualizar la alerta en el mapa
                    alerts.set(alert.issi, alert);
                } else if (alert.isInside === true) {
                    // Actualizar la propiedad isInside de la alerta existente
                    if (alerts.has(alert.issi)) {
                        const existingAlert = alerts.get(alert.issi);
                        existingAlert.isInside = alert.isInside;
                        existingAlert.message = alert.message;
                    } else {
                        // Si por alguna razón la alerta no existe, la añadimos
                        alerts.set(alert.issi, alert);
                    }
                }

                // Emitir las alertas actualizadas a los clientes
                const alertsArray = Array.from(alerts.values());
                //console.log("alertas channel: ",alertsArray.length);
                io.emit('alerta', alertsArray);
            });

            // Intervalo para limpiar alertas con isInside: true
            setInterval(() => {
                for (const [issi, alert] of alerts.entries()) {
                    //console.log("alert.isInside",alert.isInside);
                    if (alert.isInside === true) {
                        alerts.delete(issi);
                    }
                }
                const alertsArray = Array.from(alerts.values());
                //console.log("borra alertas: ",alertsArray.length);
                io.emit('alerta', alertsArray);
            }, 10000); // Ajusta el intervalo según tus necesidades

        } catch (error) {
            console.error('Error en la configuración de Redis Subscriber:', error);
        }
    })();

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
        if (issis.length === 0) return;
        const workers = Object.values(cluster.workers);
        const numWorkers = workers.length;
        const issisPerWorker = Math.ceil(issis.length / numWorkers);

        workers.forEach((worker, index) => {
            const start = index * issisPerWorker;
            const end = start + issisPerWorker;
            const issisForWorker = issis.slice(start, end);
            worker.send({ issis: issisForWorker });
            //issisForWorker.length > 0 ? console.log(`Worker ${index} ${worker.process.pid} assigned ${issisForWorker.join(",")} `) : "";

        });
    };
    assignIssisToWorkers();
    setInterval(assignIssisToWorkers, 8000); // Actualizar asignaciones cada minuto (ajusta según tus necesidades)
    setInterval(setUnidades, 10000);
    setInterval(getUbicaciones, 15000);
} else {
    console.log(`Worker process ${process.pid} started`);

    // Inicializar Redis en el worker
    const { createClient } = require('redis');
    const redisClient = createClient();

    redisClient.connect().then(() => {
        console.log('Redis_SERENAZGO: client connected in worker');
    }).catch((err) => {
        console.error('Error connecting Redis in worker:', err);
    });

    let assignedIssis = []; // Variable para almacenar las ISSIs asignadas

    process.on('message', (msg) => {
        if (msg.issis) {
            assignedIssis = msg.issis;
        }
    });

    setInterval(() => monitorIssis(assignedIssis), 10000);

    socketServer.listen(PORT_SERENAZGO, async () => {
        try {
            const log = await login();
            if (log)
                console.log(`SERENAZGO: Servidor corriendo en el puerto ${PORT_SERENAZGO} & logeado correctamente con ${cache.get("sesion")._empresa}`);
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
