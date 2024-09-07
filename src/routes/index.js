const { Router } = require("express");
const router = Router();
const unidadesRouter = require("../routes/unidadesRouter");
const camarasRouter = require("../routes/camarasRouter");
const radioRouter = require("../routes/radiosRouter");
const puntosTacticosRouter = require("../routes/puntosTacticosRouter");
const issisRouter = require("../routes/issisRouter");
const redisClient = require("../redisClient");

//Prefijos para las rutas
router.use("/api", unidadesRouter);
router.use("/camaras", camarasRouter);
router.use("/radios", radioRouter);
router.use("/puntostacticos", puntosTacticosRouter);
router.use("/issis", issisRouter);
router.use("/redis", async (req, res) => {
    try {
        // Asegurarse de que Redis esté conectado
        if (!redisClient.isOpen) {
            await redisClient.connect(); // Conectar si no está conectado
        }
        // Ahora que Redis está conectado, podemos ejecutar la operación `set`
        await redisClient.set('clave_ejemplo', 'Hola desde Redis');
        console.log('Clave establecida en Redis.');

        // Obtener el valor de Redis después de haberlo establecido
        const reply = await redisClient.get('clave_ejemplo');
        console.log('Valor obtenido de Redis:', reply); // "Hola desde Redis"
        return res.status(200).json({ value: reply });

    } catch (error) {
        console.error('Error conectando a Redis:', error.message);
        return res.status(500).json({ error: `Error conectando a Redis: ${error.message}` });
    }
});

module.exports = router;
