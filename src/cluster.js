require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const numCPUs = os.cpus().length;
const sequelize = require("./database");
const { login } = require("./controllers/loginController");
const { setUnidades, monitorIssis } = require("./checkers/vigilanciaIssis");

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
    setInterval(setUnidades, 10000);
    setInterval(monitorIssis, 10000);
} else {
    console.log(`Worker process ${process.pid} started`);
    require("./server");  // Solo levantamos el servidor en los workers
}


/* 

Master: El bloque if (cluster.isMaster) se ejecuta en el proceso principal. Aquí se crean los procesos workers usando cluster.fork(), que hace una copia del código en cada núcleo del procesador disponible.

Workers: Los workers ejecutan el mismo código que el proceso master, pero manejan las solicitudes HTTP de manera independiente. El servidor HTTP está en cada worker, y las solicitudes se distribuyen entre ellos.

Reemplazo de workers: Si un worker falla, el proceso principal detecta el fallo y lo reemplaza automáticamente creando un nuevo worker.

*/
